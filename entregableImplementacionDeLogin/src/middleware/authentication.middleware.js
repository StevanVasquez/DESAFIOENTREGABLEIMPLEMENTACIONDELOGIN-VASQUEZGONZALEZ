const authenticationMiddle = (req, res, next) => {
    console.log('Validando session');
    if (req.session?.user) {
        return next();
    }
    return res.redirect("login");
}
export default authenticationMiddle;