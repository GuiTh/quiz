import React, { useEffect } from "react";
import "./quiz.css";

type QuizQuestion = {
  question: string;
  rightAnswer: string;
  allOptions: string[];
  flag?: string;
};

type countryiesArr = {
  name: country;
  flag: string;
};

type country = {
  common: string;
};

type common = {
  name: {
    common: string;
  };
};

export default function Quiz() {
  const [countries, setCountries] = React.useState<[]>([]);
  const [quiz, setQuiz] = React.useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = React.useState<number>(0);
  //o estado comeca como start pra visualizar o componente de comecar
  const [quizView, setQuizView] = React.useState<string>("start");
  const [selectedAnswer, setSelectedAnswer] = React.useState<String | null>(
    null
  );
  const [isAnswerRight, setIsAnswerRight] = React.useState<Boolean>(false);

  //1 -> useEffect repsonsavel por fazer o fetch da api, filtra os paises que tem capital
  useEffect(() => {
    if (countries.length === 0) {
      fetch("https://restcountries.com/v3.1/all")
        .then((resp) => resp.json())
        .then((result) => {
          const countriesArrayResult = result.filter(
            (country: { [fieldName: string]: string }) => country
          );
          //define os paises e chama a funcao createQuiz com o valor do filter
          setCountries(countriesArrayResult);
          createQuiz(countriesArrayResult);
        });
    }
    //2 -> verifica se existe valor no estado de countries e se existir seta o estado de quizes com isso
    if (countries.length > 0) createQuiz(countries);
    //esse useEffect sera chamado sempre que ouver alteracao no estado de countries
  }, [countries]);

  // 3-> Embaralha o array
  const shuffleArray = (array: any[]) => {
    const newArr = array.slice();

    for (let i = newArr.length - 1; i > 0; i--) {
      const random = Math.floor(Math.random() * (i + 1));

      [newArr[i], newArr[random]] = [newArr[random], newArr[i]];
    }

    return newArr;
  };

  const createQuiz = (countriesArray: countryiesArr[]) => {
    //4 -> cria array vazio
    const newQuiz: QuizQuestion[] = [];

    //embaralha o array que veio como parametro do createQuiz
    countriesArray = shuffleArray(countriesArray);

    for (let i = 0; i < 5; i++) {
      //5 -> pega o array passado como parammetro
      const rightCountry = countriesArray[i];
      //6 -> percorre cada elemento do array embaralhado 4 vezes
      const incorrectOptions = shuffleArray(countriesArray)
        //7 -> filtra no array todas as opcoes que sao diferentes da correta
        .filter(
          (country: common) => country.name.common !== rightCountry.name.common
        )
        .slice(0, 3)
        .map((country: common) => country.name.common);
      //8 -> cria um objeto com a pergunta, a resposta correta, as opcoes e a bandeira
      const newQuizQuestion: QuizQuestion = {
        question: "De quem é essa bandeira?" + "  " + rightCountry.flag,
        rightAnswer: rightCountry.name.common,
        allOptions: shuffleArray([
          ...incorrectOptions,
          rightCountry.name.common,
        ]),
        flag: rightCountry.flag,
      };

      //9 -> puxa esse resultado pro array criado
      newQuiz.push(newQuizQuestion);
    }
    //10 -> guarda o quiz embaralhado nessa variavel, define setquiz com essa variavel, o index do quiz e a visualizacao inicial
    const shuffledQuiz = shuffleArray(newQuiz);
    setQuiz(shuffledQuiz);
    setQuizIndex(0);
    setQuizView("start");
  };

  //O que vai ser renderizado no comeco do jogo, a primeira tela
  const startQuiz = (
    <div className="p-4 rounded-xl border">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl text-center">Tenta a sorte</h2>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="border-2 border-gray-500 rounded-lg px-6 py-2 text-lg text-black capitalize hover:bg-white text-black"
          onClick={() => {
            setQuizView("question");
          }}
        >
          Começar
        </button>
      </div>
    </div>
  );

  // 12 -> Componente principal do jogo, renderiza a bandeira, as opcoes e valida se esta certa ou nao
  const viewQuizQuestions = quiz.length > 0 && (
    <div className="rounded-xl relative overflow-visible">
      <div>
        <h3 className="text-xl text-center pt-4">{quiz[quizIndex].question}</h3>
        <ul className="p-0"></ul>
      </div>

      {/* Mapeia todas as opcoes de resposta */}
      {quiz[quizIndex].allOptions.map((answer, answerIndex) => {
      // verifica se a resposta atual é a correta, e se ja foi marcada como a certa no estado isAnswerRight
      const isCorrectAnswer = answer === quiz[quizIndex].rightAnswer && isAnswerRight;
      // verifica se a resposta atual é a mesma selecionada, se ela é diferente da correta e se ja foi selecionada no estado isAnswerRight
      const isIncorrectAnswer = answer === selectedAnswer && answer !== quiz[quizIndex].rightAnswer && isAnswerRight;
      // verifica se a resposta atual é a mesma selecionada e se não é a correta no estado isRightAnswer
      const isSelectedAnswer = answer === selectedAnswer && !isAnswerRight;

      // Definir cores com base nas condições
      // altera a cor do botao
      const buttonColor =isCorrectAnswer || isIncorrectAnswer || isSelectedAnswer ? "text-white" : "text-blue-500";
      // altera o background
      const buttonBackgroundColor = isCorrectAnswer ? "bg-green-500" : isIncorrectAnswer ? "bg-red-500" : isSelectedAnswer? "bg-yellow-400" : "bg-white";

      return (
        <li key={answer} className="py-4 list-none">
          <div className="flex items-center justify-between">
            <button
              className={`${buttonColor} ${buttonBackgroundColor} border-2 rounded-lg w-full p-3 text-left hover:${buttonBackgroundColor.replace(
                "500",
                "600"
              )}`}
              // verifica se a resposta é a certa e define o estado de selectedAnswer pra reposta escolhida
              onClick={() => !isAnswerRight && setSelectedAnswer(answer)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {answerIndex}: {answer}
                </span>
                {/* Renderiza um icone que demonstra se ta certo ou nao a resposta e qual era a correta caso esteja errado */}
                {isCorrectAnswer && <span className="ml-2 text-white">✔️</span>}
                {selectedAnswer === answer &&
                  isAnswerRight &&
                  !isCorrectAnswer && (
                    <span className="ml-2 text-white">❌</span>
                  )}
              </div>
            </button>
          </div>
        </li>
      );
    })}
      {/* Renderiza um novo batao caso o estado selectedAnswer seja verdadeiro */}
      {selectedAnswer && (
        <div className="flex justify-end pt-0">
          <button
            className="bg-yellow-500 text-white rounded-lg px-6 py-2 text-lg capitalize"
            onClick={() => {
              // Verifica se a resposta nao foi selecionada mas nao foi avaliada
              if (!isAnswerRight) setIsAnswerRight(true);
              // Verifica se a opcao ja foi marcada, redefine o estado da resposta selecionada pra nulo e a verificacao pra ver se a resposta é a certa pra falso
              else {
                setSelectedAnswer(null);
                setIsAnswerRight(false);
                // se a opcao marcada é a certa, incrementa o index do quiz e pula para a proxima bandeira
                if (quiz[quizIndex].rightAnswer === selectedAnswer)
                  setQuizIndex(quizIndex + 1);
                else {
                  // Senao, mostra os resultados
                  setQuizView("results");
                }
              }
            }}
          >
            {/* Muda o texto do botao baseado nas validacoes do estado, caso isAnswerRight n tenha sido definida, ele pede para validar */}
            {!isAnswerRight
              ? "Validar"
              : // caso o isAnswerRight seja definido, verifica se a resposta esta certa ou nao
              quiz[quizIndex].rightAnswer === selectedAnswer
              ? "Proximo"
              : "Ver Resultados"}
          </button>
        </div>
      )}
    </div>
  );

  //renderiza uma mensagem de acordo com a quantidade de bandeiras corretas
  const howManyFlags = () => {
    let result;
    if (quizIndex === 0) {
      result = <span>Você não acertou nenhuma bandeira!</span>;
    } else if (quizIndex === 1) {
      result = <span>Você acertou {quizIndex} bandeira</span>;
    } else {
      result = <span>Você acertou {quizIndex} bandeiras</span>;
    }
    return <p className="text-xl">{result}</p>;
  };

  //Mensagem com o resultado das perguntas
  const resultsQuizView = (
    <div className="p-4">
      <div className="text-center">
        <h3 className="text-3xl">Resultados</h3>
      </div>
      <div className="flex flex-col justify-center mt-4 text-center">
        {howManyFlags()}
        {/* 13 -> reinicia o quiz refazendo a logica da funcao createQuiz de dar fetch nos paises, selecionar 5 e embaralhar o array com as opcoes de cada um */}
        <button
          className="border-2 border-gray-500 rounded-lg px-6 py-2 text-lg capitalize mt-4"
          onClick={() => createQuiz(countries)}
        >
          Tente novamente
        </button>
      </div>
    </div>
  );

  //primeiro componente, aquele que inicia o jogo
  const quizEl = (
    <>
      <div className="max-w-sm mx-auto content-center justify-center h-screen ">
        {quiz && (
          <div className="w-full py-5">
            <h2 className="text-3xl font-bold text-center uppercase mb-4">
              Quiz dos paises
            </h2>
            {/* 11 -> Verifica o estado atual de quizView e renderiza de acordo com o valor */}
            {quizView === "start" && startQuiz}
            {quizView === "question" && viewQuizQuestions}
            {quizView === "results" && resultsQuizView}
          </div>
        )}
      </div>
    </>
  );

  return <div>{quizEl}</div>;
}
