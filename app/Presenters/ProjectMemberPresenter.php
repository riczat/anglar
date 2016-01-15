<?php

namespace app\Presenters;

use app\Transformers\ProjectMemberTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ProjectMemberPresenter
 *
 * @package namespace app\Presenters;
 */
class ProjectMemberPresenter extends FractalPresenter
{
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProjectMemberTransformer();
    }
}
