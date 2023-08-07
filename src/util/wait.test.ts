import wait from "./wait";

test("util/wait::wait - wait more than 1 sec", async () => {
    expect.assertions(1);

    const before = new Date();

    await wait(1000);

    const after = new Date();

    expect((after.valueOf() - before.valueOf()) >= 1000).toEqual(true);
});
