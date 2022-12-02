import { Customers, AuthNonces } from './index.js';

const UseCustomerInformation = async (req, res, next) => {
  const nonce =
    req.cookies[`${process.env.NAMESPACE}.AuthNonce`] ||
    req.headers['x-auth-nonce'];
  if (!nonce) {
    return res.status(401).json({
      message: 'Missing nonce',
    });
  }
  const nonceCheck = await AuthNonces({}).check(nonce);
  if (!nonceCheck) {
    return res.status(401).json({
      message: 'Invalid nonce',
    });
  }
  const nonceData = await AuthNonces({}).get(nonce);
  let customer = await Customers({ id: nonceData.customer }).read('id');
  if (!customer) {
    return res.status(401).json({
      message: 'Invalid customer',
    });
  }
  delete customer.password;
  delete customer.INTERNAL_notes;
  customer.status = JSON.parse(customer.status);
  req.customer = customer;
  next();
};

export { UseCustomerInformation };
