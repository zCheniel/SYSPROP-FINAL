import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';


function Invalido(){

const [usu_name, setName] = useState('');
  const [usu_lastName, setLastname] = useState('');
  const [usu_birthday, setFdn] = useState('');
  const [usu_email, setEmail] = useState('');
  const [usu_password, setPassword] = useState('');
  const [usu_rol, setRol] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal)
    if (modal === false) {
      setNombre('');
      setUsername('');
      setCedula('');
      setFdn('');
      setCorreo('');
      setPassword('');
      setCargo(''); 
    }
  };
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsuarios = usuarios.filter(user => {
    const fullName = `${user.usu_name} ${user.usu_lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://infotpm-backend-production.up.railway.app/Users');
      setUsuarios(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = user => {
    setSelectedUser(user);
    toggle();

    setName(user.usu_name);
    setLastname(user.usu_lastName);
    setFdn(user.usu_birthday);
    setEmail(user.usu_email);
    setPassword(user.usu_password);
    setRol(user.usu_rol);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (selectedUser) {
        await axios.put(
          `https://infotpm-backend-production.up.railway.app/Users/${selectedUser.usu_id}`,
          {
            usu_name,
            usu_lastName,
            usu_email,
            usu_birthday,
            usu_password,
            usu_rol
          });
        setSelectedUser(null);

      } else {
        await axios.post(
          'https://infotpm-backend-production.up.railway.app/Users/create',
          {
            usu_name,
            usu_lastName,
            usu_email,
            usu_birthday,
            usu_password,
            usu_rol
          });
      }

      setName('');
      setLastname('');
      setFdn('');
      setEmail('');
      setPassword('');
      setRol('');
      fetchData();
      toggle();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(
        `https://infotpm-backend-production.up.railway.app/Users/${id}`
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className='containerUsers'>
        <h1 className='tituloUser'>
          Usuarios
          <div className='rayaTitulo' />
        </h1>
        <div className=" container">
          <div className='row m-5 '>
            <Input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar Usuario..."
            />
            <button
              type="button"
              className="btn btn-primary col-6"
              onClick={toggle}
            >
              Agregar Usuario
            </button>
          </div>
        </div>

        <div className="row m-4 userTable">
          <Table bordered responsive className='userTable'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Fecha de Nacimiento</th>
                <th>Cargo</th>
                <th>Funciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((user, id) => (
                <tr key={id}>
                  <td>{user.usu_id}</td>
                  <td>{user.usu_name}</td>
                  <td>{user.usu_lastName}</td>
                  <td>{user.usu_email}</td>
                  <td>{user.usu_birthday}</td>
                  <td>{user.usu_rol}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user.usu_id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal className='mt-5' isOpen={modal} size='xl' centered toggle={toggle}>
        <ModalHeader toggle={toggle}>Agregar Nuevo Usuario</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                Nombre:
              </label>
              <Input
                type="text"
                defaultValue={usu_name}
                onChange={event => setName(event.target.value)}
                className="form-control"
                id="nombre"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                apellido:
              </label>
              <Input
                type="text"
                className="form-control"
                defaultValue={usu_lastName}
                onChange={event => setLastname(event.target.value)}
                id="apellido"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Fecha de Nacimiento:
              </label>
              <Input
                className='form-control'
                id="exampleDate"
                name="date"
                defaultValue={usu_birthday}
                onChange={event => setFdn(event.target.value)}
                min="1941-01-01"
                max="2011-12-31"
                type="date"
                placeholderText='dd/MM/yyyy'
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Correo:
              </label>
              <Input
                type="text"
                className="form-control"
                defaultValue={usu_email}
                onChange={event => setEmail(event.target.value)}
                id="correo"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Contraseña:
              </label>
              <Input
                type="password"
                className="form-control"
                defaultValue={usu_password}
                onChange={event => setPassword(event.target.value)}
                id="contraseña"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Cargo:
              </label>
              <div>
                <Input
                  type="radio"
                  id="Usuario"
                  value="Usuario"
                  checked={usu_rol === 'Usuario'}
                  onChange={event => setRol(event.target.value)}
                  name="Usuario"
                />
                <label>Usuario</label>
              </div>
              <div>
                <Input
                  type="radio"
                  id="Admin"
                  name="Admin"
                  value="Administrador"
                  checked={usu_rol === 'Administrador'}
                  onChange={event => setRol(event.target.value)}
                ></Input>
                <label>Admin</label>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )

}

export default Invalido