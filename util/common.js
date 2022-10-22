import {
  animalNeedAdopt,
  animalNeedFeed,
  animalNeedHeal, animalNeedLost
} from "../client/src/utils/constants";

module.exports.getErrorResponse = (status, errorMessage) => {
  console.error(status, errorMessage);
  throw Error(`${status} : ${errorMessage}`);
}

module.exports.getPreProcessedDataBeforeSave = (payload) => {
  delete payload.id;
  delete payload.createdAt;
  return this.getPreProcessedDataBeforeUpdate(payload);
}

module.exports.getPreProcessedDataBeforeUpdate = (payload) => {
  delete payload.modifiedAt;
  payload = {...payload, 'modifiedAt': new Date()}
  return payload;
}

module.exports.convertIdBeforeSendingArray = (arrayOfObj) => {
  return arrayOfObj.map(({_id: id, ...rest}) => ({
    id, ...rest
  }));

}

module.exports.convertIdBeforeSendingObject = (Object) => {
  Object.id = Object._id
  delete Object._id
  return Object
}

module.exports.getAnimalNeedLabel = (labelText) => {
  switch (labelText) {
    case animalNeedAdopt:
      return '#adopt_me';
    case animalNeedHeal:
      return '#heal_me';
    case animalNeedFeed:
      return '#feed_me';
    case animalNeedLost:
      return '#find_me';
    default:
      return '#care';
  }
}
