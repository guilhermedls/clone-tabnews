function status(request, response) {
  response.status(200).json({
    status: 200,
    message: "Deu boma",
  });
}

export default status;
