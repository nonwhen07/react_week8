export default function CheckoutSuccessPage() {
  return (
    <div className='container-fluid'>
      <div className='position-relative d-flex'>
        <div
          className='container d-flex flex-column'
          style={{ minHeight: '100vh' }}
        >
          <nav className='navbar navbar-expand-lg navbar-light px-0'>
            <a className='navbar-brand' href='./index.html'>
              Navbar
            </a>
          </nav>
          <div className='row my-auto pb-7'>
            <div className='col-md-4 d-flex flex-column'>
              <div className='my-auto'>
                <h2>Checkout Success</h2>
                <p>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod
                </p>
                <a href='./index.html' className='btn btn-dark mt-4 px-5'>
                  Back To Home
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className='w-md-50 w-100 position-absolute opacity-1'
          style={{
            zIndex: -1,
            minHeight: '100vh',
            right: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
            backgroundPosition: 'center center',
          }}
        ></div>
      </div>
    </div>
  );
}
