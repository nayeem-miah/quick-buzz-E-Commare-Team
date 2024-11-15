interface HeadingProps {
  title: string;
  subtitle: string;
}
const Heading: React.FC<HeadingProps> = ({ title, subtitle }) => {
  return (
    <div className=" mx-auto text-center my-8">
      <h3 className="md:text-3xl uppercase py-2 text-2xl">{title}</h3>
      <p className=" mb-2"> {subtitle}</p>
    </div>
  );
};

export default Heading;
