import { Link, useHistory, useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
      database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
      history.push('/');
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja deletar a pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleMarkAsAnswered(questionId: string) {
    if (window.confirm('Tem certeza que deseja marcar como respondida?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      });
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja destacar a pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
            <Button isOutlined>
              <Link style={{ textDecoration: 'none' }} to={`/help/${roomId}`}>
                Precisa de ajuda?
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          {questions.length === 0 ? (
            <h1>Ops! Ainda não há nenhuma pergunta na sala </h1>
          ) : (
            <h1> {title}</h1>
          )}

          {questions.length > 0 && (
            <span>
              {questions.length}{' '}
              {questions.length > 1 ? 'perguntas' : 'pergunta'}
            </span>
          )}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleMarkAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Destacar pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
                <span>
                  {question.likeCount === 0 && question.likeCount > 1 ? (
                    <span>{question.likeCount} Likes</span>
                  ) : (
                    <span>{question.likeCount} Like</span>
                  )}
                </span>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
