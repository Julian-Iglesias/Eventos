import {createEventService,updateEventService,updateEventStatusService, getEventsService,getEventByIdService}from'../services/events.service.js'
import { HTTP_STATUS } from "../constants/httpStatus.js"
import { eventDTO } from '../dto/event.dto.js'

export const getEvents = async (req, res) => {
  try {
    const result = await getEventsService(req.query);

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      ...result,
      data: result.data.map(eventDTO)
    });
  } catch (error) {
    return res.status(
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json({
      status: "error",
      message: error.message || "Error interno del servidor"
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await createEventService(req.body, req.user);

    return res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      payload: eventDTO(event)
    });
  } catch (error) {
    return res
      .status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        status: "error",
        message: error.message || "Error interno del servidor"
      });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await updateEventService(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      payload: eventDTO(event)
    });
  } catch (error) {
    return res
      .status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        status: "error",
        message: error.message || "Error interno del servidor"
      });
  }
};



export const updateEventStatus = async (req, res) => {
  try {
    const event = await updateEventStatusService(
      req.params.id,
      req.body.status,
      req.user
    );

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      payload: eventDTO(event)
    });

  } catch (error) {
    return res
      .status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        status: "error",
        message: error.message || "Error interno del servidor"
      });
  }
};


export const getEventById = async (req, res) => {
  try {
    const event = await getEventByIdService(req.params.id);

    return res.status(HTTP_STATUS.OK).json({
      status: "success",
      payload: eventDTO(event)
    });
  } catch (error) {
    return res.status(
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json({
      status: "error",
      message: error.message || "Error interno del servidor"
    });
  }
};