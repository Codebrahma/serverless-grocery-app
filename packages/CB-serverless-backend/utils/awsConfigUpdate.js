import AWS from 'aws-sdk';
import {
  dbLocalUrl,
  dbRegion,
} from './config';

export default () => {
  AWS.config.update({
    region: dbRegion,
    endpoint: dbLocalUrl,
  }); 
};