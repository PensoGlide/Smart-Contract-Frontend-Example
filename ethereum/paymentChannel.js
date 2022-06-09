import web3 from './web3';
import PaymentChannel from './build/PaymentChannel.json';

const instance = new web3.eth.Contract(
    PaymentChannel,
    "0x02F0537956F267058f47747981E599950b8A74DD"
);

export default instance;