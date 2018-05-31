const publishKey = 'pk_test_rM2enW1rNROwx4ukBXGaIzhr';

/**
  Open Stripe payment modal for the payment
*/

export const displayPaymentModal = (props, onOpened, onClosed, onSubmit) => {
  const checkoutHandler = window.StripeCheckout.configure({
    key: publishKey,
    locale: 'auto',
  });
  checkoutHandler.open({
    name: `Pay Rs.${props.orderTotal}`,
    description: `Order: ${props.orderId}`,
    closed: () => {
      onClosed && onClosed();
    },
    opened: () => {
      onOpened && onOpened();
    },
    token: (token) => {
      if (token && token.id) {
        onSubmit && onSubmit({
          tokenId: token.id,
          orderId: props.orderId,
          email: token.email,
          userId: props.username,
        });
      } else {
        // to do
      }
    },
  });
};
