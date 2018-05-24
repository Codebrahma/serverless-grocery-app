const publishKey = 'pk_test_rM2enW1rNROwx4ukBXGaIzhr';

export const displayPaymentModal = (props, onOpened, onClosed, onSubmit) => {
  const checkoutHandler = window.StripeCheckout.configure({
    key: publishKey,
    locale: 'auto',
  });
  checkoutHandler.open({
    name: `Pay Rs.${props.currentOrder.orderTotal}`,
    description: `Order: ${props.currentOrder.orderId}`,
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
          orderId: props.currentOrder.orderId,
          email: token.email,
          userId: props.userData.username,
        });
      } else {
        // to do
      }
    },
  });
};
