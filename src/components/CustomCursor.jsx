import { useEffect, useRef, useState } from 'react';

function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
      }
    };

    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor"
        style={{
          transform: clicked ? 'scale(2)' : 'scale(1)',
          transition: 'width 0.3s, height 0.3s, transform 0.1s',
        }}
      />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

export default CustomCursor;
