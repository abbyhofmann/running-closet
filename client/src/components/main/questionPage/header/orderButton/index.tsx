import React from 'react';
import './index.css';
import { Button } from '@mui/material';
import { OrderType, orderTypeDisplayName } from '../../../../../types';

/**
 * Interface representing the props for the OrderButton component.
 *
 * name - The text to be displayed on the button.
 * setQuestionOrder - A function that sets the order of questions based on the message.
 */
interface OrderButtonProps {
  orderType: OrderType;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * OrderButton component renders a button that, when clicked, triggers the setQuestionOrder function
 * with the provided message.
 * It will update the order of questions based on the input message.
 *
 * @param orderType - The label for the button and the value passed to setQuestionOrder function.
 * @param setQuestionOrder - Callback function to set the order of questions based on the input message.
 */
const OrderButton = ({ orderType, setQuestionOrder }: OrderButtonProps) => (
  <Button
    variant='outlined'
    sx={{ color: '#473BF0', marginY: 'auto', marginX: 1, width: 'fitContent', height: 35 }}
    onClick={() => {
      setQuestionOrder(orderType);
    }}>
    {orderTypeDisplayName[orderType]}
  </Button>
);

export default OrderButton;
