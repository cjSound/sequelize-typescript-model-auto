import { initFactory } from './util';
import { Options } from './ferreiro-core';


export default async (options: Options) => {
    const nySeqAuto = await initFactory(options);

    await nySeqAuto.build();
};

