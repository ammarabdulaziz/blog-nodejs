module.exports = {
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        // res.status(401).json({ msg: 'Not authorized' })
        // req.flash('error_msg', 'Please log in to view that resource');
        else{

            res.redirect('/login');
        }
    },

    isNotAdmin: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }else{
            res.redirect('/admin/view-blogs');
        }
    },

  
};