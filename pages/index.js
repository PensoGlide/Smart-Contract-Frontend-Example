import React, {Component} from 'react';
import { Card, Input, Button, Form, Message, Segment, Container } from 'semantic-ui-react';
import PaymentChannel from "../ethereum/paymentChannel";
import genericPaymentChannel from '../ethereum/genericPaymentChannel';
//import { Link } from '../routes';
import web3 from '../ethereum/web3';

class paymentChannelIndex extends Component {
    state = {
        value: '',
        channelId: '',
        forDuration: '',
        ephemeralConsumerAddress: '',

        totalAmount: '',
        txOrigin: '',
        channelIdTotalAmount: '',

        address: '',
        balance: '',

        events: '',

        errorMessage: '',
        loading: false
    }

    onSubmitOpenChannel = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await PaymentChannel.methods.openChannel(
                this.state.channelId,
                this.state.forDuration,
                this.state.ephemeralConsumerAddress
            ).send({
                from: accounts[0],
                value: web3.util.fromWei(this.state.value, 'ether')
            });

            const openChannelEvent = await PaymentChannel.ChannelOpened({})
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    onSubmitTotalAmount = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const totalAmount = await PaymentChannel.methods.totalAmount(
                this.state.txOrigin,
                this.state.channelIdTotalAmount
            ).call();

            this.setState({ totalAmount: totalAmount})

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    onSubmitBalance = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const contract = genericPaymentChannel(this.state.address);
            console.log(contract)
            const balance = await contract.methods.getBalance().call();

            this.setState({ balance: balance})

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    /*
    async renderEvents() { // Isto é para criar uma "carta" na homepage usando o *semantic-ui*
        const events = await PaymentChannel.events.allEvents();
        console.log(events)
        const items = JSON.stringify(events);
        console.log(typeof items)

        //this.setState({ events: items })
        
        const items = events.map(body => {
            return {
                description: body,
                fluid: true
            };
        });
        
        return <Card.Content description={items} />
        
    }
    */

    onSubmitEvents = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            //const events = await PaymentChannel.events.allEvents({ fromBlock: "earliest" });
            const events = await PaymentChannel.events.ChannelOpened({})
                .on('data', event => console.log(event));
            console.log(events)

            this.setState({ events: events })

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }
    

    render() {
        return (
            <>
            <link
              async
              rel="stylesheet"
              href="//cdn.jsdelivr.net/npm/semantic-ui@2.0.0/dist/semantic.min.css"
            />

            <Card.Group itemsPerRow={2}>
                {/* Open Channel card */}
                <Card>
                    <Card.Content header='Open Channel'/>
                    <Form onSubmit={this.onSubmitOpenChannel} loading={this.state.loading} error={!!this.state.errorMessage}>
                        <Form.Field >
                            <label>Value</label>
                            <Input
                                value={this.state.value}
                                onChange={event =>
                                    this.setState({ value: event.target.value })}
                            />
                        </Form.Field>

                        <Form.Field >
                            <label>Channel ID</label>
                            <Input
                                value={this.state.channelId}
                                onChange={event =>
                                    this.setState({ channelId: event.target.value })}
                            />
                        </Form.Field>

                        <Form.Field >
                            <label>Duration</label>
                            <Input
                                value={this.state.forDuration}
                                onChange={event =>
                                    this.setState({ forDuration: event.target.value })}
                            />
                        </Form.Field>

                        <Form.Field >
                            <label>Ephemeral Consumer Address</label>
                            <Input
                                value={this.state.ephemeralConsumerAddress}
                                onChange={event =>
                                    this.setState({ ephemeralConsumerAddress: event.target.value })}
                            />
                        </Form.Field>

                        <Message error header='Oops' content={this.state.errorMessage} />
                        <Button primary style={{ marginBottom: '10px', marginLeft: '10px'}}>Send</Button>
                    </Form>
                </Card>


                {/* Get Balance card */}
                <Card>
                    <Card.Content header='Get Balance from Contract'/>
                    <Form onSubmit={this.onSubmitBalance} loading={this.state.loading} error={!!this.state.errorMessage}>
                        <Form.Field >
                            <label>Contract Address</label>
                            <Input
                                value={this.state.address}
                                onChange={event =>
                                    this.setState({ address: event.target.value })}
                            />
                        </Form.Field>

                        <Message error header='Oops' content={this.state.errorMessage} />
                        <Button primary style={{ marginBottom: '10px', marginLeft: '10px'}}>Send</Button>
                    </Form>
                    <Card.Content description={`The total amount (Wei) on this contract: ${this.state.balance}`}/>
                </Card>


                {/* Total Amount card */}
                <Card>
                <Card.Content header='Total Amount in Contract by Tx Origin'/>
                    <Form onSubmit={this.onSubmitTotalAmount} loading={this.state.loading} error={!!this.state.errorMessage}>
                        <Form.Field >
                            <label>Transaction Origin</label>
                            <Input
                                value={this.state.txOrigin}
                                onChange={event =>
                                    this.setState({ txOrigin: event.target.value })}
                            />
                        </Form.Field>

                        <Form.Field >
                            <label>Channel ID</label>
                            <Input
                                value={this.state.channelIdTotalAmount}
                                onChange={event =>
                                    this.setState({ channelIdTotalAmount: event.target.value })}
                            />
                        </Form.Field>

                        <Message error header='Oops' content={this.state.errorMessage} />
                        <Button primary style={{ marginBottom: '10px', marginLeft: '10px'}}>Send</Button>
                    </Form>
                    <Card.Content description={`The total amount (Wei) on this channel ID: ${this.state.totalAmount}`}/>
                </Card>

            </Card.Group>

            {/* Event Listener Card */}
            <Card>
                <Card.Content header='All Events Listener'/>
                <Button primary 
                    style={{ marginTop: '10px', marginRight: '10px'}}
                    onClick={this.onSubmitEvents}>Get events</Button>
                <Card.Content description={`${this.state.events}`}/>
            </Card>
            </>
        );
    }

};

export default paymentChannelIndex;