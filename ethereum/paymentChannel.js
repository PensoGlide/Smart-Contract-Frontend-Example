import web3 from './web3';
import PaymentChannel from './build/PaymentChannel.json';

const instance = new web3.eth.Contract(
    PaymentChannel,
    "0xAdAA7883FE7d52C270AA10625a01deba08e4d256" //ESTE É O CONTRACTO SEM O REQUIRE DAS SIGNATURES
);

export default instance;