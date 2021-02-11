const Notifications = (props) => {
  const { gameOver } = props;

  return (
    <section>
      Notifications
      { gameOver && 
        <div>
          {gameOver} Won!
        </div>
      }
    </section>
  )
}

export default Notifications;