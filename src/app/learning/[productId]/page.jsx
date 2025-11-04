"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  FileQuestion, 
  CheckCircle, 
  Lock,
  Download,
  BarChart3,
  Home,
  Video,
  Bookmark,
  Eye,
  ArrowRight,
  ArrowLeft,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/header";

// کامپوننت جداگانه برای VideoDialog
const VideoDialog = ({ lesson, open, onClose, updateLessonProgress, userProgress, fetchLessonProgress }) => {
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialTimeSet, setInitialTimeSet] = useState(false);
  const videoRef = useRef(null);
  const progressTimerRef = useRef(null);
  const lastSavedProgressRef = useRef(0);
  const lastSavedTimeRef = useRef(0);
  const isSavingRef = useRef(false);

  const saveProgress = useCallback(async (currentTime, duration, forceSave = false) => {
    if (duration <= 0 || isSavingRef.current || !lesson?._id) return;

    const progress = Math.min(100, Math.round((currentTime / duration) * 100));
    const videoCompleted = progress >= 95;

    if (forceSave || currentTime > lastSavedTimeRef.current) {
      try {
        isSavingRef.current = true;
        await updateLessonProgress(lesson._id, currentTime, duration, videoCompleted);
        lastSavedProgressRef.current = progress;
        lastSavedTimeRef.current = currentTime;
      } catch (error) {
        console.error("Error saving progress:", error);
      } finally {
        isSavingRef.current = false;
      }
    }
  }, [lesson?._id, updateLessonProgress]);

  const setInitialVideoTime = useCallback(async () => {
    if (initialTimeSet || !videoRef.current || !lesson?._id) return;

    try {
      const progressData = await fetchLessonProgress(lesson._id);
      
      if (progressData?.success && progressData.progress) {
        const progress = progressData.progress;
        const startTime = progress.watchedDuration || 0;
        
        if (!progress.videoCompleted && startTime > 0) {
          videoRef.current.currentTime = startTime;
          setCurrentTime(startTime);
          
          if (duration > 0) {
            const calculatedProgress = (startTime / duration) * 100;
            setVideoProgress(calculatedProgress);
          }
          
          lastSavedProgressRef.current = progress.progress;
          lastSavedTimeRef.current = startTime;
        }
      }
      setInitialTimeSet(true);
    } catch (error) {
      console.error("Error setting initial video time:", error);
      setInitialTimeSet(true);
    }
  }, [lesson?._id, duration, initialTimeSet, fetchLessonProgress]);

  const handleTimeUpdate = useCallback((e) => {
    const video = e.target;
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    setCurrentTime(currentTime);
    
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      setVideoProgress(progress);
    }
  }, []);

  const handleVideoEnd = useCallback(() => {
    if (duration > 0) {
      saveProgress(duration, duration, true);
      setVideoProgress(100);
    }
  }, [duration, saveProgress]);

  const handleLoadedMetadata = useCallback((e) => {
    const newDuration = e.target.duration;
    setDuration(newDuration);
    setInitialVideoTime();
  }, [setInitialVideoTime]);

  useEffect(() => {
    if (!initialTimeSet || !open) return;

    progressTimerRef.current = setInterval(() => {
      if (videoRef.current && duration > 0 && !isSavingRef.current) {
        const currentVideoTime = videoRef.current.currentTime;
        saveProgress(currentVideoTime, duration);
      }
    }, 30000);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [duration, saveProgress, initialTimeSet, open]);

  useEffect(() => {
    return () => {
      if (videoRef.current && duration > 0 && initialTimeSet) {
        saveProgress(videoRef.current.currentTime, duration, true);
      }
    };
  }, [duration, saveProgress, initialTimeSet]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLessonProgress = () => {
    const progress = userProgress.find(up => up.lesson === lesson._id);
    return progress ? progress.progress : 0;
  };

  const getWatchedDuration = () => {
    const progress = userProgress.find(up => up.lesson === lesson._id);
    return progress ? progress.watchedDuration : 0;
  };

  if (!open || !lesson || !lesson._id) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="aspect-video bg-black h-1/2">
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            className="w-full h-full"
            controls
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
          />
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">زمان گذشته:</span>
                <span className="font-medium">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">مدت ویدیو:</span>
                <span className="font-medium">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">ذخیره شده تا:</span>
                <span className="font-medium">{formatTime(getWatchedDuration())}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">پیشرفت این جلسه:</span>
                <span className="font-medium">{Math.round(videoProgress)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">پیشرفت کلی:</span>
                <span className="font-medium">{getLessonProgress()}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">وضعیت:</span>
                <span className={`font-medium ${getLessonProgress() === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                  {getLessonProgress() === 100 ? 'تکمیل شده' : 'در حال مشاهده'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>پیشرفت این جلسه</span>
              <span>{Math.round(videoProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>پیشرفت کلی این درس</span>
              <span>{getLessonProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${getLessonProgress()}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">منابع آموزشی:</h4>
              <div className="space-y-2">
                {lesson.resources.map((resource, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{resource.title}</span>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm w-full sm:w-auto">
                      <Download className="w-4 h-4" />
                      دانلود
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// کامپوننت جداگانه برای QuizDialog
const QuizDialog = ({ 
  quiz, 
  open, 
  onClose,
  quizStarted,
  currentQuestionIndex,
  userAnswers,
  quizTimeLeft,
  quizResults,
  onStartQuiz,
  onAnswerSelect,
  onNextQuestion,
  onPrevQuestion,
  onSubmitQuiz,
  getQuizResult 
}) => {
  if (!open || !quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const userAnswer = userAnswers[currentQuestionIndex];
  const previousResult = getQuizResult(quiz._id);

  const getOptionsArray = (question) => {
    if (Array.isArray(question.options)) {
      return question.options;
    }
    
    if (question.options && typeof question.options === 'object') {
      return Object.values(question.options);
    }
    
    if (typeof question.options === 'string') {
      return question.options.split(',');
    }
    
    return [];
  };

  const options = getOptionsArray(currentQuestion);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!quizStarted && !quizResults && !previousResult && (
            <div className="text-center space-y-6">
              <FileQuestion className="w-16 h-16 text-purple-500 mx-auto" />
              <h4 className="text-2xl font-bold text-gray-800">شروع آزمون</h4>
              <p className="text-gray-600 max-w-md mx-auto">{quiz.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
                  <div className="text-sm text-gray-600">تعداد سوالات</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{quiz.timeLimit}</div>
                  <div className="text-sm text-gray-600">دقیقه زمان</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">{quiz.passingScore}%</div>
                  <div className="text-sm text-gray-600">نمره قبولی</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {previousResult ? previousResult.score + '%' : '---'}
                  </div>
                  <div className="text-sm text-gray-600">آخرین نمره</div>
                </div>
              </div>

              <button
                onClick={onStartQuiz}
                className="bg-purple-500 text-white px-8 py-3 rounded-xl hover:bg-purple-600 transition-colors font-medium text-lg"
              >
                شروع آزمون
              </button>
            </div>
          )}

          {quizStarted && !quizResults && currentQuestion && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-white font-medium ${
                    quizTimeLeft < 60 ? 'bg-red-500' : 'bg-purple-500'
                  }`}>
                    {formatTime(quizTimeLeft)}
                  </div>
                  <div className="text-sm text-gray-700">
                    سوال {currentQuestionIndex + 1} از {totalQuestions}
                  </div>
                </div>
                
                <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h4>
                
                <div className="space-y-3">
                  {options.map((option, optionIndex) => {
                    const optionText = typeof option === 'object' ? option.text || option.title || option.label || JSON.stringify(option) : option;
                    
                    return (
                      <button
                        key={optionIndex}
                        onClick={() => onAnswerSelect(currentQuestionIndex, optionIndex)}
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                          userAnswer === optionIndex
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{optionText}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            userAnswer === optionIndex
                              ? 'border-purple-500 bg-purple-500 text-white'
                              : 'border-gray-300'
                          }`}>
                            {userAnswer === optionIndex && '✓'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={onPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentQuestionIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ArrowRight className="w-5 h-5" />
                  سوال قبلی
                </button>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <button
                    onClick={onSubmitQuiz}
                    className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    پایان آزمون
                  </button>
                ) : (
                  <button
                    onClick={onNextQuestion}
                    className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    سوال بعدی
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {(quizResults || previousResult) && (
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                (quizResults?.passed || previousResult?.passed) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {(quizResults?.passed || previousResult?.passed) ? (
                  <CheckCircle className="w-10 h-10" />
                ) : (
                  <div className="text-2xl font-bold">!</div>
                )}
              </div>

              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {(quizResults?.passed || previousResult?.passed) ? 'تبریک! قبول شدید' : 'متاسفانه قبول نشدید'}
                </h4>
                <p className="text-gray-600">
                  نمره شما: <span className="font-bold text-xl">{(quizResults?.score || previousResult?.score)}%</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {quizResults?.correctAnswers || previousResult?.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">پاسخ صحیح</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
                  <div className="text-sm text-gray-600">کل سوالات</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // State برای مدیریت آزمون‌ها
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [quizResults, setQuizResults] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const quizTimerRef = useRef(null);

  // تابع برای دریافت پیشرفت از سرور
  const fetchLessonProgress = useCallback(async (lessonId) => {
    try {
      if (!lessonId) return { success: false, error: "Invalid lessonId" };

      const token = localStorage.getItem("token");
      if (!token) return { success: false, error: "No token" };

      const response = await fetch(
        `/api/learning/progress?productId=${params.productId}&lessonId=${lessonId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) return { success: false, error: `HTTP ${response.status}` };

      return await response.json();
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      return { success: false, error: error.message };
    }
  }, [params.productId]);

  // تابع به‌روزرسانی پیشرفت درس
  const updateLessonProgress = useCallback(async (lessonId, watchedDuration, totalDuration, videoCompleted = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const progress = totalDuration > 0 ? Math.min(100, Math.round((watchedDuration / totalDuration) * 100)) : 0;
      
      const response = await fetch(`/api/learning/progress`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: params.productId,
          lessonId,
          progress,
          watchedDuration,
          totalDuration,
          videoCompleted
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const updatedProgress = await response.json();
      
      setUserProgress(prev => {
        const filtered = prev.filter(up => up.lesson !== lessonId);
        return [...filtered, {
          lesson: lessonId,
          progress: updatedProgress.progress,
          watchedDuration: updatedProgress.watchedDuration,
          completed: updatedProgress.completed,
          videoCompleted: updatedProgress.videoCompleted
        }];
      });

      return updatedProgress;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  }, [params.productId]);

  // تابع برای ذخیره نتایج آزمون در localStorage
  const saveQuizResult = useCallback((quizId, result) => {
    try {
      const storedResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
      storedResults[quizId] = {
        ...result,
        date: new Date().toISOString()
      };
      localStorage.setItem('quizResults', JSON.stringify(storedResults));
      return storedResults[quizId];
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }
  }, []);

  // تابع برای دریافت نتایج آزمون از localStorage
  const getQuizResult = useCallback((quizId) => {
    try {
      const storedResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
      return storedResults[quizId] || null;
    } catch (error) {
      console.error("Error getting quiz result:", error);
      return null;
    }
  }, []);

  // تابع برای شروع آزمون
  const startQuiz = useCallback(() => {
    if (!selectedQuiz) return;
    
    console.log("Starting quiz...");
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResults(null);
    
    const timeLimit = selectedQuiz.timeLimit || 30;
    setQuizTimeLeft(timeLimit * 60);
  }, [selectedQuiz]);

  // تابع برای مدیریت تایمر آزمون
  useEffect(() => {
    if (quizStarted && quizTimeLeft > 0 && quizDialogOpen) {
      quizTimerRef.current = setInterval(() => {
        setQuizTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (quizTimerRef.current) {
        clearInterval(quizTimerRef.current);
        quizTimerRef.current = null;
      }
    };
  }, [quizStarted, quizTimeLeft, quizDialogOpen]);

  // تابع برای ارسال پاسخ آزمون
  const handleQuizSubmit = useCallback(async () => {
    if (!selectedQuiz) return;

    console.log("Submitting quiz...");

    const totalQuestions = selectedQuiz.questions.length;
    let correctAnswers = 0;

    selectedQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= selectedQuiz.passingScore;

    const result = {
      score,
      passed,
      totalQuestions,
      correctAnswers,
      answers: userAnswers
    };

    console.log("Quiz results:", result);
    setQuizResults(result);
    
    saveQuizResult(selectedQuiz._id, result);
    
    if (quizTimerRef.current) {
      clearInterval(quizTimerRef.current);
      quizTimerRef.current = null;
    }
    
    setQuizStarted(false);
  }, [selectedQuiz, userAnswers, saveQuizResult]);

  // تابع برای مدیریت پاسخ کاربر
  const handleAnswerSelect = useCallback((questionIndex, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  }, []);

  // تابع برای رفتن به سوال بعدی
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, selectedQuiz]);

  // تابع برای رفتن به سوال قبلی
  const goToPrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // تابع برای بستن دیالوگ آزمون
  const closeQuizDialog = useCallback(() => {
    console.log("Closing quiz dialog");
    if (quizTimerRef.current) {
      clearInterval(quizTimerRef.current);
      quizTimerRef.current = null;
    }
    setQuizDialogOpen(false);
    setSelectedQuiz(null);
    setQuizResults(null);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizTimeLeft(0);
  }, []);

  // تابع برای باز کردن دیالوگ آزمون
  const openQuizDialog = useCallback((quiz) => {
    console.log("Opening quiz dialog for:", quiz);
    setSelectedQuiz(quiz);
    setQuizDialogOpen(true);
  }, []);


  // تابع برای باز کردن دیالوگ ویدیو
  const openVideoDialog = useCallback((lesson) => {
    setSelectedLesson(lesson);
    setVideoDialogOpen(true);
  }, []);

  // تابع برای بستن دیالوگ ویدیو
  const closeVideoDialog = useCallback(() => {
    setVideoDialogOpen(false);
    setSelectedLesson(null);
  }, []);

  useEffect(() => {
    fetchLearningData();
  }, [params.productId]);

  const fetchLearningData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/learning/${params.productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در دریافت اطلاعات دوره");
      }

      const data = await response.json();
      
      setProduct(data.product);
      setLessons(data.lessons || []);
      setAssignments(data.assignments || []);
      setQuizzes(data.quizzes || []);
      setUserProgress(data.userProgress || []);
      setIsEnrolled(data.isEnrolled || false);

    } catch (error) {
      console.error("Error fetching learning data:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // کامپوننت LessonItem
  const LessonItem = ({ lesson, index }) => {
    if (!lesson || !lesson._id) {
      return (
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-red-50">
          <p className="text-red-600">خطا در بارگذاری درس</p>
        </div>
      );
    }

    const progress = userProgress.find(up => up.lesson === lesson._id);
    const isCompleted = progress?.videoCompleted || false;
    const progressPercent = progress?.progress || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : progressPercent > 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
          }`}>
            {isCompleted ? (
              <CheckCircle className="w-5 h-5" />
            ) : progressPercent > 0 ? (
              <PlayCircle className="w-5 h-5" />
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 break-words">{lesson.title}</h4>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </span>
              {progressPercent > 0 && (
                <span className="text-blue-600 font-medium">
                  {progressPercent}% مشاهده شده
                </span>
              )}
            </div>
            
            {progressPercent > 0 && !isCompleted && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => openVideoDialog(lesson)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center mt-2 sm:mt-0"
          >
            <Eye className="w-4 h-4" />
            مشاهده ویدیو
          </button>
        </div>
      </motion.div>
    );
  };

  const AssignmentCard = ({ assignment }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{assignment.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">مهلت تحویل:</span>
          <span className="font-medium">
            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('fa-IR') : 'ندارد'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">نمره کامل:</span>
          <span className="font-medium">{assignment.maxScore} نمره</span>
        </div>
      </div>
      
      <button className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium">
        مشاهده تکلیف و ارسال پاسخ
      </button>
    </motion.div>
  );

  const QuizCard = ({ quiz }) => {
    const previousResult = getQuizResult(quiz._id);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <FileQuestion className="w-6 h-6 text-purple-500" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
            {previousResult && (
              <div className={`text-sm mt-1 ${previousResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                آخرین نمره: {previousResult.score}% - {previousResult.passed ? 'قبول' : 'رد'}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">زمان محدود:</span>
            <span className="font-medium">{quiz.timeLimit} دقیقه</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">نمره قبولی:</span>
            <span className="font-medium">{quiz.passingScore}%</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">تعداد سوالات:</span>
            <span className="font-medium">{quiz.questions.length} سوال</span>
          </div>
        </div>
        
        <button 
          onClick={() => openQuizDialog(quiz)}
          className="w-full mt-6 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors font-medium"
        >
          {previousResult ? 'مشاهده نتایج' : 'شروع آزمون'}
        </button>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-4">
                  <div className="h-96 bg-gray-300 rounded-2xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-300 rounded-xl"></div>
                  <div className="h-32 bg-gray-300 rounded-xl"></div>
                  <div className="h-32 bg-gray-300 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">دوره مورد نظر یافت نشد</h1>
            <button 
              onClick={() => router.push("/panel")}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              بازگشت به پنل کاربری
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!isEnrolled) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h1>
            <p className="text-gray-600 mb-6">
              برای دسترسی به محتوای این دوره باید ابتدا در آن ثبت‌نام کنید.
            </p>
            <button 
              onClick={() => router.push(`/products/${product.slug}`)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              مشاهده اطلاعات دوره
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* هدر دوره */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
              <button 
                onClick={() => router.push("/panel")}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
              >
                <Home className="w-4 h-4" />
                پنل کاربری
              </button>
              <span>•</span>
              <span>{product.category}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-base md:text-lg text-gray-600">مدرس: {product.teacher}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* محتوای اصلی */}
            <div className="lg:col-span-3 space-y-8">
              {/* تب‌های محتوا */}
              <div className="bg-white rounded-2xl p-1 shadow-lg overflow-x-auto">
                <nav className="flex gap-1 min-w-max">
                  {[
                    { id: "content", label: "محتوای آموزشی", icon: Video },
                    { id: "assignments", label: "نمونه سوال", icon: FileText },
                    { id: "quizzes", label: "آزمون‌ها", icon: FileQuestion },
                    { id: "resources", label: "جزوات", icon: Bookmark }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all flex-1 justify-center whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* محتوای تب‌ها */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "content" && (
                    <div className="space-y-6">
                      {lessons && lessons.length > 0 ? (
                        lessons.map((lesson, index) => (
                          <LessonItem key={lesson._id || index} lesson={lesson} index={index} />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>هنوز درسی برای این دوره تعریف نشده است</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "assignments" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {assignments.map((assignment, index) => (
                        <AssignmentCard key={assignment._id} assignment={assignment} />
                      ))}
                      {assignments.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>هنوز نمونه سوالی برای این دوره تعریف نشده است</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "quizzes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {quizzes.map((quiz, index) => (
                        <QuizCard key={quiz._id} quiz={quiz} />
                      ))}
                      {quizzes.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          <FileQuestion className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>هنوز آزمونی برای این دوره تعریف نشده است</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "resources" && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">جزوات دوره</h3>
                      <div className="space-y-4">
                        {lessons.map((lesson) => (
                          lesson.resources && lesson.resources.map((resource, index) => (
                            <div key={`${lesson._id}-${index}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl gap-3">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{resource.title}</h4>
                                  <p className="text-sm text-gray-600">مربوط به: {lesson.title}</p>
                                </div>
                              </div>
                              <button className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto">
                                <Download className="w-4 h-4" />
                                دانلود
                              </button>
                            </div>
                          ))
                        ))}
                        {lessons.every(lesson => !lesson.resources || lesson.resources.length === 0) && (
                          <p className="text-center text-gray-500 py-8">منبعی برای این دوره موجود نیست</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* سایدبار */}
            <div className="space-y-6">
              {/* فهرست دروس */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  فهرست دروس
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <div key={lesson._id || index} className="text-sm p-3 rounded-lg bg-gray-50">
                      <div className="font-medium text-gray-800">{lesson.title}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600 text-xs">{lesson.duration}</span>
                        {userProgress.find(up => up.lesson === lesson._id)?.videoCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* آمار پیشرفت */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  پیشرفت شما
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>دروس تکمیل شده</span>
                      <span>
                        {userProgress.filter(up => up.videoCompleted).length} از {lessons.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500 transition-all duration-500"
                        style={{ 
                          width: `${lessons.length > 0 ? (userProgress.filter(up => up.videoCompleted).length / lessons.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {assignments.length}
                      </div>
                      <div className="text-sm text-gray-600">تکلیف</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <div className="text-2xl font-bold text-purple-600">
                        {quizzes.length}
                      </div>
                      <div className="text-sm text-gray-600">آزمون</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* دیالوگ ویدیو */}
      <VideoDialog 
        lesson={selectedLesson} 
        open={videoDialogOpen}
        onClose={closeVideoDialog}
        updateLessonProgress={updateLessonProgress}
        userProgress={userProgress}
        fetchLessonProgress={fetchLessonProgress}
      />

      {/* دیالوگ آزمون */}
      <QuizDialog 
        quiz={selectedQuiz} 
        open={quizDialogOpen}
        onClose={closeQuizDialog}
        quizStarted={quizStarted}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        quizTimeLeft={quizTimeLeft}
        quizResults={quizResults}
        onStartQuiz={startQuiz}
        onAnswerSelect={handleAnswerSelect}
        onNextQuestion={goToNextQuestion}
        onPrevQuestion={goToPrevQuestion}
        onSubmitQuiz={handleQuizSubmit}
        getQuizResult={getQuizResult}
      />
    </>
  );
}