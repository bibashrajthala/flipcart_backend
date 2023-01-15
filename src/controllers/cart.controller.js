import Cart from "../models/cart.model.js";

// one user should have only one cart, one cart can contain multiple products , but for same product should not be repeated in a cart , for same product added multiple time only quantity of that product should be updated
export const addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) {
      return res.status(400).json({ error });
    }

    // if cart for loggedIn user already exists, no need to create new cart, just update the same cart
    if (cart) {
      const product = req.body.cartItemToAdd.product;
      const item = cart.cartItems.find(
        (cartItem) => cartItem.product == product // strict equality wont work as product is of ObjectId type (not string)
      );

      let condition, action;

      //if product to be added is already in cart , just update the quantity of cartItems with that product
      if (item) {
        // console.log(item);
        condition = { user: req.user._id, "cartItems.product": product };
        action = {
          $set: {
            "cartItems.$": {
              ...req.body.cartItemToAdd,
              quantity: item.quantity + req.body.cartItemToAdd.quantity,
            },
          },
        };
      } else {
        //if product to be added is not in cart , push/add it to the cart
        // console.log(req.body.cartItemToAdd);
        (condition = { user: req.user._id }),
          (action = {
            $push: {
              cartItems: req.body.cartItemToAdd,
            },
          });
      }

      Cart.findOneAndUpdate(condition, action).exec((error, _cart) => {
        if (error) return res.status(400).json({ error });
        if (_cart) return res.status(201).json({ _cart });
      });
    } else {
      // if cart for loggedIn user dont exists,  create new cart and put cart item to add in it
      const cart = new Cart({
        user: req.user._id,
        cartItems: [req.body.cartItemToAdd],
      });
      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) return res.status(201).json({ cart });
      });
    }
  });
};
