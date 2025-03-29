// First export the tables without relations
export { default as users } from './user';
export { default as freelancers } from './freelancers';
export { default as orders } from './order';
export { default as transaction } from './transactions';
export { default as review } from './reviews';
export { default as pricing } from './pricing';

// Then export the relations
export { roleEnum, adminUserEmailAddresses, accounts, authenticators, sessions, verificationTokens, userRelations } from './user';
export { freelancerRelations } from './freelancers';
export { orderRelations } from './order';
export { reviewRelations } from './reviews';
export { transactionRelations, paymentStatusEnum } from './transactions';

// Export pricing-related schema
export { 
  academicLevels, subjectCategories, assignmentTypes, deadlineFactors 
} from './pricing';
