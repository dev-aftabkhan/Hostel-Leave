const { decryptData, encryptData } = require("../utils/cryptoUtils");
const  requestController = require("../services/requestService");

exports.updateRequestStatus = async (req, res) => {
  try {
    // 🔓 decrypt incoming request
    const decryptedBody = decryptData(req.body.encrypted);
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
      encrypted: encryptData({
        message: message || "Request status updated successfully",
        request_status: updatedRequest.request_status
      })
    });
    
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};
// request by status
exports.getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const requests = await requestController.getRequestsByStatus(status);

    res.status(200).json({
      encrypted: encryptData(requests)
    });
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};
