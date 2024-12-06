import Schedule from '../models/schedule.js';

// Add Schedule
export const addSchedule = async (req, res) => {
    try {
        const { route, bus, departureTime, arrivalTime } = req.body;

        if (!route || !bus || !departureTime || !arrivalTime) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        const schedule = new Schedule({ route, bus, departureTime, arrivalTime });
        await schedule.save();

        res.status(201).send({ message: 'Schedule added successfully', schedule });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get All Schedules
export const getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('route bus');
        res.send({ message: 'Schedules fetched successfully', schedules });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update Schedule
export const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { departureTime, arrivalTime, status } = req.body;

        const schedule = await Schedule.findByIdAndUpdate(
            id,
            { departureTime, arrivalTime, status },
            { new: true }
        );

        if (!schedule) {
            return res.status(404).send({ message: 'Schedule not found.' });
        }

        res.send({ message: 'Schedule updated successfully', schedule });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete Schedule
export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await Schedule.findByIdAndDelete(id);
        if (!schedule) {
            return res.status(404).send({ message: 'Schedule not found.' });
        }

        res.send({ message: 'Schedule deleted successfully', schedule });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};