import { useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import Modal from "react-modal";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import "../styles/room.scss";

Modal.setAppElement("#root");

type RoomParams = {
  id: string;
};

export function RoomAdmin() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [questionId, setQuestionId] = useState("");

  function openModal(questionId: string) {
    setQuestionId(questionId);
    setIsOpen(true);
  }
  function closeModal() {
    setQuestionId("");
    setIsOpen(false);
  }

  async function handleDeleteQuestion() {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    closeModal();
  }

  async function handleQuestionHighlighted(questionId: string) {
    const questionDatabase = database.ref(`rooms/${roomId}/questions/${questionId}`);
    const question = (await questionDatabase.get()).val();
    await questionDatabase.update({
      isHighlighted: (!question.isHighlighted),
    });
  }

  async function handleQuestionAsAnswered(questionId: string) {
    const questionDatabase = database.ref(`rooms/${roomId}/questions/${questionId}`);
    const question = (await questionDatabase.get()).val();
    await questionDatabase.update({
      isAnswered: (!question.isAnswered),
    });
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  return (
    <>
      <div id="page-room">
        <header>
          <div className="content">
            <Link to="/">
              <img src={logoImg} alt="Logo" />
            </Link>
            <div>
              <RoomCode code={roomId} />
              <Button onClick={handleEndRoom} isOutlined>
                Encerrar Sala
              </Button>
            </div>
          </div>
        </header>

        <main className="content">
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} perguntas</span>}
          </div>

          <div className="questions-list">
            {questions.map((q, i) => (
              <Question 
                key={q.id} 
                content={q.content} 
                author={q.author} 
                isAnswered={q.isAnswered}
                isHighlighted={q.isHighlighted}
              >
                <button type="button" onClick={() => handleQuestionAsAnswered(q.id)}>
                  <img src={checkImg} alt="Marcar como Respondida" />
                </button>
                {!q.isAnswered &&                 <button type="button" onClick={() => handleQuestionHighlighted(q.id)}>
                  <img src={answerImg} alt="Marcar como Destaque" />
                </button>}
                <button type="button" onClick={() => openModal(q.id)}>
                  <img src={deleteImg} alt="Excluir Pergunta" />
                </button>
              
              </Question>
            ))}
          </div>
        </main>
      </div>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="room-admin-modal"
          overlayClassName="room-admin-modal-overlay"
          contentLabel="Example Modal"
        >
          <div className="room-admin-delete">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5.99988H5H21"
                stroke="#737380"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                stroke="#737380"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <strong>Excluir pergunta</strong>
            <p>Tem certeza que deseja excluir esta pergunta?</p>
            <div>
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={handleDeleteQuestion}>Excluir</button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
