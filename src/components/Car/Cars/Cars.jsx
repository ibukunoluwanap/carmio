import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { NotificationSuccess, NotificationError } from "../../Notifications";
import PropTypes from 'prop-types';
import { Container, Row, Col, Alert } from "react-bootstrap";
import CarCard from '../CarCard/CarCard';
import Loader from "../../Loader";
import { buyCarAction, getCarsAction, bidCarAction } from "../../../utils/carmio";

const Cars = ({ carSection, address, balance, fetchBalance }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);

    // get cars data
    const getCars = async () => {
        setLoading(true);
        getCarsAction()
            .then(cars => {
                if (cars) {
                    toast(<NotificationSuccess text="Successfully loader cars." />);
                    setCars(cars);
                }
            })
            .catch(() => {
                toast(<NotificationError text="Failed to load cars." />);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getCars();
    }, []);

    // buy car
    const buyCar = async (car) => {
        setLoading(true);
        buyCarAction(address, car)
            .then(() => {
                toast(<NotificationSuccess text="Car bought successfully" />);
                getCars();
                fetchBalance(address);
            })
            .catch(error => {
                toast(<NotificationError text="Failed to purchase car." />);
                setLoading(false);
            })
    };

    // bid car
    const bidCar = async (car, biddingPrice) => {
        setLoading(true);
        bidCarAction(address, car, biddingPrice)
            .then(() => {
                toast(<NotificationSuccess text="Car bid successfully" />);
                getCars();
                fetchBalance(address);
            })
            .catch(() => {
                toast(<NotificationError text="Failed to bid car." />);
                setLoading(false);
            })
    };

    if (loading) {
        return (
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col sm={3} className="text-center">
                        <Loader />
                        <br />
                        <Alert variant="info" className="p-2 border-none">
                            Loading Car details!!!
                        </Alert>
                    </Col>
                </Row>
            </Container>);
    }

    return (
        <Container ref={carSection} className="my-5">
            <Row>
                {cars.map((car, index) => (
                    <Col key={index} sm={3} className="mt-5">
                        <CarCard address={address} car={car} balance={balance} fetchBalance={fetchBalance} buyCar={buyCar} bidCar={bidCar} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

Cars.propTypes = {
    goToCarSection: PropTypes.func,
    address: PropTypes.string.isRequired,
    balance: PropTypes.number,
    fetchBalance: PropTypes.func.isRequired,
};

export default Cars;