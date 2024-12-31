const { Router } = require("express");
const memberShipController = require("../controllers/memberShipController");

const memberShipRouter = Router();

memberShipRouter.get("/member", memberShipController.getMemberPage);
memberShipRouter.post("/member", memberShipController.updateMember);

memberShipRouter.get("/admin", memberShipController.getAdminPage);
memberShipRouter.post("/admin", memberShipController.updateAdmin);

memberShipRouter.get("/member/remove", memberShipController.removeMemberStatus);
memberShipRouter.get("/admin/remove", memberShipController.removeAdminStatus);

module.exports = memberShipRouter;
