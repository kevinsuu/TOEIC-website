import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Box, TextField, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Quiz = () => {
  const { type } = useParams();
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [options, setOptions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [results, setResults] = useState([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/vocabulary.json")
      .then((response) => response.json())
      .then((data) => setWords(data));
  }, []);

  const getRandomOptions = useCallback(
    (words, correctWord, numOptions) => {
      const incorrectOptions = [];
      while (incorrectOptions.length < numOptions) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const option = type === "cn-to-en" ? randomWord.English : randomWord.Chinese;
        if (option !== (type === "cn-to-en" ? correctWord.English : correctWord.Chinese) && !incorrectOptions.includes(option)) {
          incorrectOptions.push(option);
        }
      }
      return incorrectOptions;
    },
    [type]
  );

  const generateQuestion = useCallback(
    (words, idx) => {
      const word = words[idx];
      const correctAnswer = type === "cn-to-en" ? word.English : word.Chinese;
      const incorrectAnswers = getRandomOptions(words, word, 3);
      const allOptions = shuffle([correctAnswer, ...incorrectAnswers]);
      setCurrentWord(word);
      setOptions(allOptions);
    },
    [type, getRandomOptions]
  );

  useEffect(() => {
    if (quizStarted && words.length > 0) {
      const randomWords = shuffle(words).slice(0, numQuestions);
      setSelectedWords(randomWords);
      generateQuestion(randomWords, 0);
    }
  }, [quizStarted, words, numQuestions, generateQuestion]);

  useEffect(() => {
    if (selectedWords.length > 0) {
      generateQuestion(selectedWords, index);
    }
  }, [index, selectedWords, generateQuestion]);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const checkAnswer = (answer) => {
    const correctAnswer = type === "cn-to-en" ? currentWord.English : currentWord.Chinese;
    const result = {
      question: currentWord,
      correctAnswer,
      selectedAnswer: answer,
      isCorrect: answer === correctAnswer,
    };
    setResults([...results, result]);

    if (answer === correctAnswer) {
      setScore(score + 1);
    }

    if (index < numQuestions - 1) {
      setIndex(index + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 100) {
      setSnackbarMessage("題數最大100題");
      setSnackbarOpen(true);
      setNumQuestions(100);
    } else if (value < 1) {
      setSnackbarMessage("題數最小為1題");
      setSnackbarOpen(true);
      setNumQuestions(1);
    } else {
      setNumQuestions(value);
    }
  };

  const startQuiz = () => {
    if (numQuestions > 100) {
      setSnackbarMessage("題數最大100題");
      setSnackbarOpen(true);
    } else if (numQuestions < 1) {
      setSnackbarMessage("題數最小為1題");
      setSnackbarOpen(true);
    } else {
      setQuizStarted(true);
    }
  };

  const reStartQuiz = () => {
    setQuizStarted(false);
    setIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedWords([]);
    setResults([]);
  };

  const goHome = () => {
    navigate("/");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!quizStarted) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
        <Typography variant="h2" gutterBottom>
          開始 {type === "cn-to-en" ? "中翻英" : "英翻中"} 測驗
        </Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            label="輸入題數"
            type="number"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            variant="outlined"
            margin="normal"
            style={{ marginRight: "8px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={startQuiz}
            style={{ height: "56px" }} // match the TextField height
          >
            開始測驗
          </Button>
        </Box>
        <Button variant="contained" color="secondary" onClick={goHome}>
          回到首頁
        </Button>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  if (selectedWords.length === 0) return <div>Loading...</div>;

  return (
    <Box>
      {!showResults ? (
        <>
          <Typography variant="h4" gutterBottom>
            {type === "cn-to-en" ? "中翻英" : "英翻中"} 測驗
          </Typography>
          <Typography variant="h5" gutterBottom>
            {type === "cn-to-en" ? currentWord.Chinese : currentWord.English}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {index + 1} / {numQuestions}
          </Typography>
          <Box display="flex" flexDirection="column">
            {options.map((option, idx) => (
              <Button
                key={idx}
                variant="contained"
                color="primary"
                onClick={() => checkAnswer(option)}
                style={{ margin: "5px 0", textTransform: "none" }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            測驗結束！您的得分是 {score} / {numQuestions}
          </Typography>
          {results.map((result, idx) => (
            <Box key={idx} mb={2}>
              <Typography variant="h6">
                問題 {idx + 1}: {type === "cn-to-en" ? result.question.Chinese : result.question.English}
              </Typography>
              <Typography variant="body1">正確答案: {result.correctAnswer}</Typography>
              <Typography variant="body1" color={result.isCorrect ? "green" : "red"}>
                您的答案: {result.selectedAnswer}
              </Typography>
            </Box>
          ))}
          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={reStartQuiz} style={{ marginRight: "10px" }}>
              重新測驗
            </Button>
            <Button variant="contained" color="secondary" onClick={goHome}>
              回到首頁
            </Button>
          </Box>
        </>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Quiz;
