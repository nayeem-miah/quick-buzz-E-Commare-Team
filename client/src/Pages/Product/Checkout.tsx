import React from "react";

const Checkout: React.FC = () => {
  const handleBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const date = formData.get("date");
    const email = formData.get("email");
    const brandName = formData.get("brandName");
    const location = formData.get("location");
    const number = formData.get("number");

    // Log values or handle form submission logic
    console.log({ name, date, email, brandName, location, number });
  };

  return (
    <div>
      <form onSubmit={handleBooking} className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input type="text" name="name" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input type="date" name="date" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input type="email" name="email" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Brand Name</span>
            </label>
            <input
              type="text"
              name="brandName"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              name="location"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Number</span>
            </label>
            <input
              type="number"
              name="number"
              className="input input-bordered"
            />
          </div>
        </div>
        <div className="form-control mt-6">
          <input
            className="btn bg-[#55BFC1] btn-block"
            type="submit"
            value="Confirm Bookings"
          />
        </div>
      </form>
    </div>
  );
};

export default Checkout;
