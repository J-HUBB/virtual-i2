const Skeleton = ({ width, height, display }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        display,
      }}
    ></div>
  );
};

export default Skeleton;
