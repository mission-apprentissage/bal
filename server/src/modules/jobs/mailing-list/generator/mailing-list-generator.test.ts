import { describe, it, vi, expect, beforeEach } from "vitest";
import { forEachMailingListBatch } from "./mailing-list-generator";

describe("forEachMailingListBatch", () => {
  const start = new Date("2024-01-01T00:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(start);

    return () => {
      vi.useRealTimers();
    };
  });

  it("should call the callback with correct bounds for each batch", async () => {
    const params = { start: 1, total: 2500 };
    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(10_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 1000 }, null);
    expect(callback).toHaveBeenCalledWith({ from: 1001, to: 2000 }, new Date(start.getTime() + 25_000));
    expect(callback).toHaveBeenCalledWith({ from: 2001, to: 2500 }, new Date(start.getTime() + 25_000));
  });

  it("should handle cases where total is less than batch size", async () => {
    const params = { start: 1, total: 500 };
    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 500 }, null);
  });

  it("should throw an error if the signal is aborted", async () => {
    const params = { start: 1, total: 1500 };
    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    controller.abort(new Error("Aborted"));

    await expect(forEachMailingListBatch(params, callback, signal)).rejects.toThrow("Aborted");
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call the callback if start is greater than total", async () => {
    const params = { start: 100, total: 50 };
    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should work correctly when start is greater than 1", async () => {
    const params = { start: 501, total: 1000 };
    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ from: 501, to: 1000 }, null);
  });

  it("should work correctly when total is exactly a multiple of batch size", async () => {
    const params = { start: 1, total: 3000 };
    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 1000 }, null);
    expect(callback).toHaveBeenCalledWith({ from: 1001, to: 2000 }, new Date(start.getTime() + 3_000));
    expect(callback).toHaveBeenCalledWith({ from: 2001, to: 3000 }, new Date(start.getTime() + 3_000));
  });

  it("should work correctly when start and total are the same", async () => {
    const params = { start: 5000, total: 5000 };

    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ from: 5000, to: 5000 }, null);
  });

  it("should workd correctly when total is multiple of batch size + 1", async () => {
    const params = { start: 1, total: 2001 };

    const callback = vi.fn().mockImplementation(() => {
      vi.advanceTimersByTime(1_000); // Simulate some async work
    });
    const controller = new AbortController();
    const signal = controller.signal;

    await forEachMailingListBatch(params, callback, signal);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith({ from: 1, to: 1000 }, null);
    expect(callback).toHaveBeenCalledWith({ from: 1001, to: 2000 }, new Date(start.getTime() + 2_001));
    expect(callback).toHaveBeenCalledWith({ from: 2001, to: 2001 }, new Date(start.getTime() + 2_001));
  });
});
