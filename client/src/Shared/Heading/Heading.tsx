interface HeadingProps {
  title: string;
  subtitle: string;
}
const Heading: React.FC<HeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center space-y-5 container mx-auto md:py-5">
      <h3 className="text-2xl font-bold md:text-3xl lg:text-4xl text-black">
        {title}
      </h3>
      <h3 className="lg:text-xl font-medium   text-black">{subtitle}</h3>
    </div>
  );
};

export default Heading;
