const Notifications = (props) => {
  const { gameOver } = props;

  return (
    <section id='notifications'>
      Notifications
      { gameOver && 
        <div>
          {gameOver} Won!
        </div> &&
        <button
          onClick={props.onReset}>
          Play Again
        </button>
      }
    </section>
  )
}

export default Notifications;