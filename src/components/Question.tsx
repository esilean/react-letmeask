import { ReactNode } from "react";
import "../styles/question.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted: boolean,
  isAnswered: boolean,
  children?: ReactNode;
};

export function Question({ content, author, isHighlighted, isAnswered, children }: QuestionProps) {
  return (
    <div className={`question ${isHighlighted ? 'highlighted': ''} ${isAnswered ? 'answered': ''}`}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
