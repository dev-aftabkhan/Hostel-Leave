const { decryptData, encryptData } = require("../utils/cryptoUtils");
const  requestController = require("../services/requestService");

exports.updateRequestStatus = async (req, res) => {
  try {
    // 🔓 decrypt incoming request
    const decryptedBody = req.body;
    const { requestId, status, remark } = decryptedBody;

    // 👤 User comes from JWT authMiddleware
    const userID = req.user.id;

    const { request: updatedRequest, message } = await requestController.updateRequestStatus(
      requestId,
      userID,
      status,
      remark
    );

    res.status(200).json({
       
        message: message || "Request status updated successfully",
        request_status: updatedRequest.request_status
       
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// request by status
exports.getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const requests = await requestController.getRequestsByStatus(status);

    res.status(200).json({
      encrypted:  requests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
