export default function CheckoutPaymentPage() {
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-10'>
          <nav className='navbar navbar-expand-lg navbar-light px-0'>
            <a className='navbar-brand' href='./index.html'>
              Navbar
            </a>
            <ul className='list-unstyled mb-0 ms-md-auto d-flex align-items-center justify-content-between justify-content-md-end w-100 mt-md-0 mt-4'>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Lorem ipsum</span>
              </li>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Lorem ipsum</span>
              </li>
              <li>
                <i className='fas fa-dot-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Lorem ipsum</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-md-10'>
          <h3 className='fw-bold mb-4 pt-3'>Lorem ipsum</h3>
        </div>
      </div>
      <div className='row flex-row-reverse justify-content-center pb-5'>
        <div className='col-md-4'>
          <div className='border p-4 mb-4'>
            <div className='d-flex'>
              <img
                src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                alt=''
                className='me-2'
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
              <div className='w-100'>
                <div className='d-flex justify-content-between'>
                  <p className='mb-0 fw-bold'>Lorem ipsum</p>
                  <p className='mb-0'>NT$12,000</p>
                </div>
                <p className='mb-0 fw-bold'>x1</p>
              </div>
            </div>
            <div className='d-flex mt-2'>
              <img
                src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                alt=''
                className='me-2'
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
              <div className='w-100'>
                <div className='d-flex justify-content-between'>
                  <p className='mb-0 fw-bold'>Lorem ipsum</p>
                  <p className='mb-0'>NT$12,000</p>
                </div>
                <p className='mb-0 fw-bold'>x1</p>
              </div>
            </div>
            <table className='table mt-4 border-top border-bottom text-muted'>
              <tbody>
                <tr>
                  <th
                    scope='row'
                    className='border-0 px-0 pt-4 font-weight-normal'
                  >
                    Subtotal
                  </th>
                  <td className='text-end border-0 px-0 pt-4'>NT$24,000</td>
                </tr>
                <tr>
                  <th
                    scope='row'
                    className='border-0 px-0 pt-0 pb-4 font-weight-normal'
                  >
                    Payment
                  </th>
                  <td className='text-end border-0 px-0 pt-0 pb-4'>ApplePay</td>
                </tr>
              </tbody>
            </table>
            <div className='d-flex justify-content-between mt-4'>
              <p className='mb-0 h4 fw-bold'>Total</p>
              <p className='mb-0 h4 fw-bold'>NT$24,000</p>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='accordion' id='accordionExample'>
            <div className='card rounded-0'>
              <div
                className='card-header bg-white border-0 py-3'
                id='headingOne'
                data-bs-toggle='collapse'
                data-bs-target='#collapseOne'
                aria-expanded='true'
                aria-controls='collapseOne'
              >
                <p className='mb-0 position-relative custom-checkout-label'>
                  Lorem ipsum
                </p>
              </div>
              <div
                id='collapseOne'
                className='collapse show'
                aria-labelledby='headingOne'
                data-bs-parent='#accordionExample'
              >
                <div className='card-body bg-light ps-5 py-4'>
                  <div className='mb-2'>
                    <label for='Lorem ipsum1' className='text-muted mb-0'>
                      Lorem ipsum
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='Lorem ipsum1'
                      placeholder='Lorem ipsum'
                    />
                  </div>
                  <div className='mb-0'>
                    <label for='Lorem ipsum2' className='text-muted mb-0'>
                      Lorem ipsum
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='Lorem ipsum2'
                      placeholder='Lorem ipsum'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='card rounded-0'>
              <div
                className='card-header bg-white border-0 py-3 collapsed'
                id='headingTwo'
                data-bs-toggle='collapse'
                data-bs-target='#collapseTwo'
                aria-expanded='true'
                aria-controls='collapseTwo'
              >
                <p className='mb-0 position-relative custom-checkout-label'>
                  Lorem ipsum
                </p>
              </div>
              <div
                id='collapseTwo'
                className='collapse'
                aria-labelledby='headingTwo'
                data-bs-parent='#accordionExample'
              >
                <div className='card-body bg-light ps-5 py-4'>
                  <div className='mb-2'>
                    <label for='Lorem ipsum1' className='text-muted mb-0'>
                      Lorem ipsum
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='Lorem ipsum1'
                      placeholder='Lorem ipsum'
                    />
                  </div>
                  <div className='mb-0'>
                    <label for='Lorem ipsum2' className='text-muted mb-0'>
                      Lorem ipsum
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='Lorem ipsum2'
                      placeholder='Lorem ipsum'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='card rounded-0'>
              <div
                className='card-header bg-white border-0 py-3 collapsed'
                id='headingThree'
                data-bs-toggle='collapse'
                data-bs-target='#collapseThree'
                aria-expanded='true'
                aria-controls='collapseThree'
              >
                <p className='mb-0 position-relative custom-checkout-label'>
                  Lorem ipsum
                </p>
              </div>
              <div
                id='collapseThree'
                className='collapse'
                aria-labelledby='headingThree'
                data-bs-parent='#accordionExample'
              >
                <div className='card-body bg-light ps-5 py-4'>
                  <div className='mb-2'>
                    <label for='Lorem ipsum1' className='text-muted mb-0'>
                      Lorem ipsum
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='Lorem ipsum1'
                      placeholder='Lorem ipsum'
                    />
                  </div>
                  <div className='mb-0'>
                    <label for='Lorem ipsum2' className='text-muted mb-0'>
                      Lorem ipsum
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='Lorem ipsum2'
                      placeholder='Lorem ipsum'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
            <a href='./product.html' className='text-dark mt-md-0 mt-3'>
              <i className='fas fa-chevron-left me-2'></i> Lorem ipsum
            </a>
            <a
              href='./checkout-success.html'
              className='btn btn-dark py-3 px-7'
            >
              Lorem ipsum
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
