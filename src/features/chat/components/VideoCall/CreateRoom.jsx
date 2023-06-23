import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";

const CreateRoom = () => {
  const history = useHistory();
  function create() {
    const id = uuid();
    history.push(`/room/${id}`);
  }

  return <button onClick={create}>Create room</button>;
};

export default CreateRoom;
