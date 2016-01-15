<?php

namespace app\Presenters;

use app\Transformers\ProjectTaskTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ProjectMemberPresenter
 *
 * @package namespace app\Presenters;
 */
class ProjectTaskPresenter extends FractalPresenter
{
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProjectTaskTransformer();
    }
}
