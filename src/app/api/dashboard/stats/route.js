import { connectDB } from "../../../../lib/db";
import Enrollment from "../../../../models/Enrollment";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "توکن احراز هویت یافت نشد" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;

    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ error: "توکن نامعتبر است" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // دریافت اطلاعات کاربر
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return new Response(JSON.stringify({ error: "کاربر یافت نشد" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // دریافت enrollments کاربر
    const enrollments = await Enrollment.find({ user: decoded.id }).sort({
      lastAccessed: -1,
    });

    // اضافه کردن اطلاعات محصول برای هر enrollment
      const enrichedEnrollments = await Promise.all(
        enrollments.map(async (e) => {
          const product = await Product.findById(e.product).select(
            "title category level hours rating score"
          );

          const productData = product
            ? {
                ...product.toObject(),
                rating: product.rating?.average || 0,
              }
            : null;

          return {
            ...e.toObject(),
            product: productData,
          };
        })
      );


    // محاسبه آمار پایه
    const totalCourses = enrichedEnrollments.length;
    const completedCourses = enrichedEnrollments.filter((e) => e.completed).length;
    const inProgressCourses = totalCourses - completedCourses;
    const averageProgress = totalCourses > 0
      ? Math.round(enrichedEnrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0;

    // تحلیل پیشرفته یادگیری
    const learningPatterns = enrichedEnrollments.reduce((patterns, e) => {
      const category = e.product?.category || 'نامشخص';
      if (!patterns[category]) {
        patterns[category] = { count: 0, totalProgress: 0, completed: 0 };
      }
      patterns[category].count++;
      patterns[category].totalProgress += e.progress;
      if (e.completed) patterns[category].completed++;
      return patterns;
    }, {});

    // تحلیل نتایج آزمون‌ها و نقاط قوت و ضعف
    let strengthsAndWeaknesses = [];
    try {
      // اگر مدل Quiz و داده‌های آزمون دارید، اینجا باید داده‌ها را از دیتابیس بگیرید
      // فعلاً ساختار خالی برای جلوگیری از ReferenceError
      const userQuizResults = {};
      const quizPerformance = Object.entries(userQuizResults).reduce((acc, [quizId, result]) => {
        const category = enrichedEnrollments.find(e => 
          e.product?.quizzes?.some(q => q._id === quizId)
        )?.product?.category || 'نامشخص';
        if (!acc[category]) {
          acc[category] = {
            scores: [],
            correctAnswers: 0,
            totalQuestions: 0
          };
        }
        acc[category].scores.push(result.score);
        acc[category].correctAnswers += result.correctAnswers;
        acc[category].totalQuestions += result.totalQuestions;
        return acc;
      }, {});
      strengthsAndWeaknesses = Object.entries(quizPerformance).map(([category, data]) => {
        const avgQuizScore = data.scores.length > 0 
          ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length 
          : 0;
        const courseProgress = enrichedEnrollments
          .filter(e => e.product?.category === category)
          .reduce((sum, e) => sum + e.progress, 0) / 
          enrichedEnrollments.filter(e => e.product?.category === category).length || 0;
        const accuracyRate = data.totalQuestions > 0 
          ? (data.correctAnswers / data.totalQuestions) * 100 
          : 0;
        return {
          category,
          overallScore: (avgQuizScore * 0.4) + (courseProgress * 0.4) + (accuracyRate * 0.2),
          details: {
            quizScore: avgQuizScore,
            courseProgress,
            accuracyRate
          }
        };
      });
    } catch (err) {
      strengthsAndWeaknesses = [];
    }

    // تحلیل نقاط قوت و ضعف با ترکیب همه داده‌ها
    const strengths = [];
    const weaknesses = [];
    const categoryAnalysis = new Map();

    // ترکیب داده‌های پیشرفت دوره و نتایج آزمون
    Object.entries(learningPatterns).forEach(([category, data]) => {
      const analysis = strengthsAndWeaknesses.find(sw => sw.category === category) || {
        overallScore: (data.totalProgress / data.count),
        details: {
          quizScore: 0,
          courseProgress: data.totalProgress / data.count,
          accuracyRate: 0
        }
      };

      categoryAnalysis.set(category, {
        score: analysis.overallScore,
        details: {
          ...analysis.details,
          completionRate: (data.completed / data.count) * 100,
          consistencyScore: data.count >= 2 ? 100 : 50
        }
      });
    });

    // تحلیل نهایی و دسته‌بندی
    categoryAnalysis.forEach((analysis, category) => {
      const entry = {
        category,
        score: Math.round(analysis.score),
        details: {
          ...analysis.details,
          insights: []
        }
      };

      // اضافه کردن بینش‌های خاص
      if (analysis.details.quizScore > 80) {
        entry.details.insights.push('تسلط بالا در آزمون‌ها');
      }
      if (analysis.details.accuracyRate > 90) {
        entry.details.insights.push('دقت بالا در پاسخ‌گویی');
      }
      if (analysis.details.courseProgress > 75) {
        entry.details.insights.push('پیشرفت مداوم و پایدار');
      }
      if (analysis.details.consistencyScore > 80) {
        entry.details.insights.push('تعهد و پیگیری منظم');
      }

      if (analysis.score >= 70) {
        strengths.push(entry);
      }
      if (analysis.score < 40) {
        weaknesses.push(entry);
      }
    });

    // محاسبه سرعت یادگیری در دسته‌های مختلف
    // محاسبه سرعت یادگیری در دسته‌های مختلف
const learningVelocities = enrichedEnrollments.reduce((velocities, e) => {
  const timeTaken = e.product?.hours ? (e.progress / 100) * e.product.hours : 0;
  const velocity = timeTaken > 0 ? e.progress / timeTaken : 0;
  const category = e.product?.category || 'نامشخص';
  if (!velocities[category]) {
    velocities[category] = [];
  }
  velocities[category].push(velocity);
  return velocities;
}, {});

    // توابع کمکی برای تحلیل
    function calculateLearningPace(velocities) {
      const avgVelocities = Object.values(velocities).map(v => 
        v.reduce((sum, val) => sum + val, 0) / v.length
      );
      const overallAvg = avgVelocities.reduce((sum, v) => sum + v, 0) / avgVelocities.length;
      
      if (overallAvg > 8) return 'سریع';
      if (overallAvg > 4) return 'متوسط';
      return 'آهسته';
    }

    function calculateConsistencyLevel(enrollments) {
      const activeEnrollments = enrollments.filter(e => e.progress > 0);
      const consistencyScore = activeEnrollments.length > 0
        ? activeEnrollments.reduce((sum, e) => sum + (e.progress >= 25 ? 1 : 0), 0) / activeEnrollments.length
        : 0;
      
      if (consistencyScore > 0.8) return 'بسیار منظم';
      if (consistencyScore > 0.5) return 'نسبتاً منظم';
      return 'نیازمند بهبود نظم';
    }

    function calculateEngagementScore(enrollments) {
      if (enrollments.length === 0) return 0;
      
      const engagementFactors = enrollments.map(e => {
        let score = 0;
        score += e.progress * 0.5;
        score += e.completed ? 50 : 0;
        return score;
      });
      
      return Math.round(
        engagementFactors.reduce((sum, score) => sum + score, 0) / enrollments.length
      );
    }

    function generateRecommendations(strengths, weaknesses, avgProgress, inProgressCount) {
      const recommendations = [];
      
      // توصیه‌های مبتنی بر نقاط ضعف
      if (weaknesses.length > 0) {
        weaknesses.forEach(weakness => {
          const rec = `تقویت ${weakness.category} با تمرکز بر: `;
          const details = [];
          
          if (weakness.details.quizScore < 60) {
            details.push('مرور مجدد مفاهیم و تمرین بیشتر آزمون‌ها');
          }
          if (weakness.details.accuracyRate < 70) {
            details.push('تمرکز بر دقت در پاسخ‌گویی به سؤالات');
          }
          if (weakness.details.courseProgress < 50) {
            details.push('افزایش زمان مطالعه و تکمیل دوره‌ها');
          }
          
          recommendations.push(rec + details.join('، '));
        });
      }
      
      // توصیه‌های مبتنی بر پیشرفت کلی
      if (avgProgress < 50) {
        recommendations.push('برنامه‌ریزی منظم روزانه و افزایش ساعات مطالعه');
      }
      
      // توصیه‌های مدیریت دوره‌ها
      if (inProgressCount > 3) {
        recommendations.push('اولویت‌بندی و تکمیل دوره‌های در حال انجام قبل از شروع دوره جدید');
      }
      
      // توصیه‌های مبتنی بر نقاط قوت
      if (strengths.length > 0) {
        strengths.forEach(strength => {
          if (strength.details.insights.length > 0) {
            recommendations.push(
              `ادامه مسیر عالی در ${strength.category} با تمرکز بر ${strength.details.insights.join(' و ')}`
            );
          } else {
            recommendations.push(
              `پیشرفت در مسیر تخصصی ${strength.category}`
            );
          }
        });
      }
      
      // توصیه‌های تکمیلی
      const overallAccuracy = weaknesses.concat(strengths)
        .reduce((acc, curr) => acc + curr.details.accuracyRate, 0) / 
        (weaknesses.length + strengths.length) || 0;
      
      if (overallAccuracy < 75) {
        recommendations.push('تمرکز بر کیفیت یادگیری و درک عمیق مفاهیم به جای سرعت پیشروی');
      }
      
      return recommendations;
    }

    function generateOverallStatus(analysis, progress, completed, inProgress, streak) {
      let status = '';
      
      if (completed === 0 && inProgress === 0) {
        return 'به تازگی شروع به یادگیری کرده‌اید. آماده شروع یک سفر هیجان‌انگیز باشید!';
      }
      
      const strengths = analysis.preferredCategories.length;
      const consistency = analysis.consistencyLevel;
      
      if (progress > 75 && consistency === 'بسیار منظم') {
        status = 'شما یک یادگیرنده فوق‌العاده با عملکرد عالی هستید';
      } else if (progress > 50 && strengths >= 2) {
        status = 'در حال پیشرفت خوب در چندین حوزه تخصصی هستید';
      } else if (inProgress > 0 && streak > 7) {
        status = 'با پشتکار خوب در حال پیشرفت هستید';
      } else {
        status = 'در مسیر یادگیری هستید و پتانسیل زیادی برای پیشرفت دارید';
      }
      
      return status;
    }

    // تحلیل هوشمند سبک یادگیری
    const points = completedCourses * 100 + inProgressCourses * 50;
    const streak = Math.floor(Math.random() * 15) + 1;
    const productivityScore = Math.round(
      averageProgress * 0.4 + completedCourses * 20 + (totalCourses > 0 ? enrichedEnrollments.reduce((sum, e) => sum + (parseInt(e.product?.hours) || 0) * (e.progress / 100) * 60, 0) / 60 : 0) * 0.1
    );
    const learningVelocity = totalCourses > 0 ? Math.round((averageProgress / totalCourses) / 10) : 0;

    const learningStyleAnalysis = {
      preferredCategories: strengths.map(s => s.category),
      challengingAreas: weaknesses.map(w => w.category),
      learningPace: calculateLearningPace(learningVelocities),
      consistencyLevel: calculateConsistencyLevel(enrichedEnrollments),
      engagementScore: calculateEngagementScore(enrichedEnrollments),
      recommendedActions: generateRecommendations(
        strengths, 
        weaknesses, 
        averageProgress,
        inProgressCourses
      )
    };

    const overallStatus = generateOverallStatus(
      learningStyleAnalysis,
      averageProgress,
      completedCourses,
      inProgressCourses,
      streak
    );

    const stats = {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
        createdAt: user.createdAt,
        points,
        streak,
      },
      enrollments: enrichedEnrollments,
      overview: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        averageProgress,
        totalStudyTime: Math.round(enrichedEnrollments.reduce((sum, e) => sum + (parseInt(e.product?.hours) || 0) * (e.progress / 100) * 60, 0) / 60), // ساعت
        weeklyStudyTime: Math.round((enrichedEnrollments.reduce((sum, e) => sum + (parseInt(e.product?.hours) || 0) * (e.progress / 100) * 60, 0) * 0.2) / 60),
        productivityScore,
        learningVelocity,
        consistencyScore: Math.min(100, inProgressCourses * 25),
        learningAnalysis: learningStyleAnalysis,
        overallStatus,
        insights: {
          strengths: strengths.map(s => ({
            category: s.category,
            score: Math.round(s.score),
          })),
          weaknesses: weaknesses.map(w => ({
            category: w.category,
            score: Math.round(w.score),
          })),
          patterns: Object.entries(learningPatterns).map(([category, data]) => ({
            category,
            progress: Math.round(data.totalProgress / data.count),
            completion: Math.round((data.completed / data.count) * 100),
          })),
        }
      },
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return new Response(JSON.stringify({ error: "خطا در سرور" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
