const Skeleton = ({
  width,
  height,
  display,
}: {
  width: string;
  height: string;
  display: string;
}) => {
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
