import { Router } from "express";
import category from "./category";
import item from "./item";
import doc from "./doc";
import division from "./division";
import unit from "./unit";
import people from "./people";
import auth from "./auth";
import permission from "./permission";
import role from "./role";

const router = Router();

router.use('/category', category);
router.use('/item', item)
router.use('/doc', doc)
router.use('/division', division)
router.use('/unit', unit)
router.use('/people', people)
router.use('/auth', auth)
router.use('/permission', permission)
router.use('/role', role)

export default router;