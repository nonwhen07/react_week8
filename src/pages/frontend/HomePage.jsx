export default function HomePage() {
  return (
    <div className='container-fluid'>
      <div
        className='position-absolute'
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
          backgroundPosition: 'center center',
          opacity: 0.1,
          zIndex: -1,
        }}
      ></div>
      <div
        className='container d-flex flex-column'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <div className='row justify-content-center my-auto'>
          <div className='col-md-4 text-center'>
            <h2>Lorem ipsum.</h2>
            <p className='text-muted mb-0'>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod.
            </p>
            <button className='btn btn-dark rounded-0 mt-6'>
              Lorem ipsum.
            </button>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-md-4 mt-md-4'>
            <div className='card border-0 mb-4'>
              <img
                src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                className='card-img-top rounded-0'
                alt='...'
              />
              <div className='card-body text-center'>
                <h4>Lorem ipsum</h4>
                <div className='d-flex justify-content-between'>
                  <p className='card-text text-muted mb-0'>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 mt-md-4'>
            <div className='card border-0 mb-4'>
              <img
                src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                className='card-img-top rounded-0'
                alt='...'
              />
              <div className='card-body text-center'>
                <h4>Lorem ipsum</h4>
                <div className='d-flex justify-content-between'>
                  <p className='card-text text-muted mb-0'>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 mt-md-4'>
            <div className='card border-0 mb-4'>
              <img
                src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                className='card-img-top rounded-0'
                alt='...'
              />
              <div className='card-body text-center'>
                <h4>Lorem ipsum</h4>
                <div className='d-flex justify-content-between'>
                  <p className='card-text text-muted mb-0'>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-light mt-7'>
        <div className='container'>
          <div
            id='carouselExampleControls'
            className='carousel slide'
            data-ride='carousel'
          >
            <div className='carousel-inner'>
              <div className='carousel-item active'>
                <div className='row justify-content-center py-7'>
                  <div className='col-md-6 text-center'>
                    <h3>Lorem ipsum.</h3>
                    <p className='my-5'>
                      “Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat.”
                    </p>
                    <p>
                      <small>—Lorem ipsum dolor sit amet.—</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className='carousel-item'>
                <div className='row justify-content-center py-7'>
                  <div className='col-md-6 text-center'>
                    <h3>Lorem ipsum.</h3>
                    <p className='my-5'>
                      “Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat.”
                    </p>
                    <p>
                      <small>—Lorem ipsum dolor sit amet.—</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className='carousel-item'>
                <div className='row justify-content-center py-7'>
                  <div className='col-md-6 text-center'>
                    <h3>Lorem ipsum.</h3>
                    <p className='my-5'>
                      “Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat.”
                    </p>
                    <p>
                      <small>—Lorem ipsum dolor sit amet.—</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <a
              className='carousel-control-prev'
              href='#carouselExampleControls'
              role='button'
              data-slide='prev'
            >
              <span
                className='carousel-control-prev-icon'
                aria-hidden='true'
              ></span>
              <span className='sr-only'>Previous</span>
            </a>
            <a
              className='carousel-control-next'
              href='#carouselExampleControls'
              role='button'
              data-slide='next'
            >
              <span
                className='carousel-control-next-icon'
                aria-hidden='true'
              ></span>
              <span className='sr-only'>Next</span>
            </a>
          </div>
        </div>
      </div>
      <div className='container my-7'>
        <div className='row'>
          <div className='col-md-6'>
            <img
              src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
              alt=''
              className='img-fluid'
            />
          </div>
          <div className='col-md-4 m-auto text-center'>
            <h4 className='mt-4'>Lorem ipsum</h4>
            <p className='text-muted'>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna.
            </p>
          </div>
        </div>
        <div className='row flex-row-reverse justify-content-between mt-4'>
          <div className='col-md-6'>
            <img
              src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
              alt=''
              className='img-fluid'
            />
          </div>
          <div className='col-md-4 m-auto text-center'>
            <h4 className='mt-4'>Lorem ipsum</h4>
            <p className='text-muted'>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
