import { initFactory } from './util';
export default async (options) => {
    const nySeqAuto = await initFactory(options);
    await nySeqAuto.build();
};
//# sourceMappingURL=index.js.map