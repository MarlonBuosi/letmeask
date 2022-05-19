import { Link, useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';

type RoomParams = {
  id: string;
};

export function Help() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <RoomCode code={roomId} />

          <div>
            <Button isOutlined>Precisa de ajuda? </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Precisa de ajuda? Mande um email para: marlonbuosi@gmail.com </h1>
        </div>
      </main>
    </div>
  );
}
