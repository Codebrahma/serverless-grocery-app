import AWS from 'aws-sdk';
import {
  config
} from './config';

export default () => {
  AWS.config.update({
    region: config.dbRegion,
    endpoint: config.dbLocalUrl,
  });
};