import { describe, it, vi, expect } from "vitest";
import { forEachMailingListBatch } from "./mailing-list-generator";

describe("forEachMailingListBatch", () => {
  it("should call the callback with correct bounds for each batch", async () => {
    const params = { start: 1, total: 25000 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 10000 });
    expect(callback).toHaveBeenCalledWith({ from: 10001, to: 20000 });
    expect(callback).toHaveBeenCalledWith({ from: 20001, to: 25000 });
  });

  it("should handle cases where total is less than batch size", async () => {
    const params = { start: 1, total: 5000 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 5000 });
  });

  it("should throw an error if the signal is aborted", async () => {
    const params = { start: 1, total: 15000 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    controller.abort(new Error("Aborted"));

    await expect(forEachMailingListBatch(params, callback, signal)).rejects.toThrow("Aborted");
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call the callback if start is greater than total", async () => {
    const params = { start: 100, total: 50 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should work correctly when start is greater than 1", async () => {
    const params = { start: 5001, total: 10000 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ from: 5001, to: 10000 });
  });

  it("should work correctly when total is exactly a multiple of batch size", async () => {
    const params = { start: 1, total: 30000 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 10000 });
    expect(callback).toHaveBeenCalledWith({ from: 10001, to: 20000 });
    expect(callback).toHaveBeenCalledWith({ from: 20001, to: 30000 });
  });

  it("shoudl work correctly when start and total are the same", async () => {
    const params = { start: 5000, total: 5000 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ from: 5000, to: 5000 });
  });

  it("should workd correctly when total is multiple of batch size + 1", async () => {
    const params = { start: 1, total: 20001 };
    const callback = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 10000 });
    expect(callback).toHaveBeenCalledWith({ from: 10001, to: 20000 });
    expect(callback).toHaveBeenCalledWith({ from: 20001, to: 20001 });
  });
});
