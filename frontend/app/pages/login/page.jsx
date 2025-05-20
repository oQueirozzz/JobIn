'use client';

async function login(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    // verifique se a rota está correta pode ser que o localhost não seja 3000
    const response = await fetch('http://localhost:3000/usuarios/login', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      setResponseContent('Login realizado com sucesso!');
      window.location.href = '/';
    } else {
      alert(data.mensagem || 'Usuário não encontrado ou senha incorreta');
    }
  } catch (error) {
    alert('Erro ao conectar com o servidor.');
  }
}


export default function Login() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
      <div className="w-[500px] bg-white rounded-lg shadow-xl p-10">

        <div className="flex justify-center mb-6">
          <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
        </div>

        <form className="w-full" id="cadastroForm" onSubmit={login}>

          <div className="relative z-0 w-full mb-5 group">
            <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-vinho focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-vinho peer-focus:dark:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" > Email </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input type="password" name="senha" id="senha" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-vinho focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
            <label htmlFor="senha" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-vinho peer-focus:dark:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" > Senha </label>
          </div>


          <button type="submit" className=" cursor-pointer text-white bg-vinho  font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300"> Login</button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">Não possui conta?</p>

        <p className="text-sm text-center text-gray-700 mt-2">Cadastrar-se como{' '}
          <a href="/cadAlunos" className="text-vinho ">Candidato</a>{' '}ou{' '}
          <a href="/cadEmpresas" className="text-vinho"> Empresa</a>
        </p>

      </div>
    </section>

  );
}

// cadastro

//  <form className="w-full" id="cadastroForm">
//           <div className="relative z-0 w-full mb-5 group">
//             <input type="text" name="nome" id="nome" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
//             <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" > Nome </label>
//           </div>

//           <div className="relative z-0 w-full mb-5 group">
//             <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required /> <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" > Email </label>
//           </div>

//           <div className="relative z-0 w-full mb-5 group">
//             <input type="password" name="senha" id="senha" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required /> <label htmlFor="senha" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" > Senha </label>
//           </div>

//           <div className="grid sm:grid-cols-2 sm:gap-6"> <div className="relative z-0 w-full mb-5 group"> <input type="text" name="cpf" id="cpf" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required /> <label htmlFor="cpf" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" >   CPF </label> </div>
//             <div className="relative z-0 w-full mb-5 group"> <input type="date" name="data_nascimento" id="data_nascimento" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required /> <label htmlFor="data_nascimento" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" >   Data de Nascimento </label> </div>
//           </div>

//           <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Cadastrar-se</button>
//         </form>