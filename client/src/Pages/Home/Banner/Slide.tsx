
const Slide:React.FC = ({ image }) => {
    return (
        <div
            className='bg-center  bg-cover h-[38rem]'
            style={{
                backgroundImage: `url(${image})`,
            }}
        >
            <div className='flex  items-center justify-center w-full h-full'>
                <div className='text-center'>
                    <h1 className='text-4xl font-semibold text-white lg:text-4xl'>
                       
                    </h1>
                    <br />
               
                </div>
            </div>
        </div>
    )
}

export default Slide