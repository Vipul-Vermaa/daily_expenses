// splitting equal
export const splitEqually = (amount, participants) => {
    const splitAmount = amount / participants.length;
    return participants.map((participant) => ({
        ...participant,
        amount_owed: splitAmount,

    }));
};

// splitting exact
export const splitExact = (participants) => {
    return participants;
};

// splitting in percentage
export const splitByPercentage = (amount, participants) => {
    let totalPercentage = 0;

    const splitParticipants = participants.map((participant) => {
        if (!participant.percentage || participant.percentage <= 0) {
            throw new Error('Each participant must have a valid percentage greater than 0');
        }
        totalPercentage += participant.percentage;
        return {
            ...participant,
            amount_owed: (amount * participant.percentage) / 100,
        };
    });

    if (totalPercentage !== 100) {
        throw new Error('Total percentage must add up to 100');
    }

    return splitParticipants;
};