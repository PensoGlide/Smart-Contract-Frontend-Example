import web3 from './web3';
import PaymentChannel from './build/PaymentChannel.json';

export default (address) => {
    return new web3.eth.Contract(
        PaymentChannel,
        address
    );
};